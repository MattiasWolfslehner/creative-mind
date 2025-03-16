import {html, render} from 'lit-html';
import {Idea, Model, Room, store} from "../../model";
import {produce} from "immer";
import {distinctUntilChanged, map} from "rxjs";
import roomService from "../../service/room-service";
import ideaService from "../../service/idea-service";
import participationService from "../../service/participation-service";
import mbparameterService from "../../service/morpho-service";
import morphoService from "../../service/morpho-service";
import {MBRealization} from "../../model/mbrealization";

class RoomManagerSocketService extends HTMLElement {

    protected roomId: string | null = null;
    protected userId: string | null = null;
    protected socket: WebSocket | null = null;
    protected timeOutSet: number | null = null;

    protected static socketService: RoomManagerSocketService | null = null;

    protected socketStatus: string [] = [];

    // private returnString() {
    //     return document.createRange().createContextualFragment(`${this.messages}`);
    // }
    // private sendMessageToServer(message: string) {
    //     if (this.socket && this.socket.readyState === WebSocket.OPEN) {
    //         this.socket.send(message);
    //     } else {
    //         console.error('WebSocket connection is not open.');
    //     }
    // }


    private async _handleWebSocketMessage(event: MessageEvent) {
        event.preventDefault();
        const message = JSON.parse(event.data);

        switch (message.response_type) {
            case "room_closed":
            case "room_started":
                message.message = ""; // clear noisy roomid messages
            case "room_changed": // new response_type when admin changes desc/name
            case "room_notification": {
                console.log(`${message.response_type}: "${message.message}"`);
                function capitalize(s)
                {
                    return String(s[0]).toUpperCase() + String(s).slice(1);
                }
                // (${message.response_type.toString().replace("_", " ")})
                let response_type = capitalize(message.response_type.toString().replace("_notification", "").replace("_", " "));
                this.pushMessage(`${response_type}${(message.message==="")?"":(': "'+message.message+'"')}`);
                const y = participationService.getParticipantsInRoom(null);
                const x = roomService.getRoom(null);
                this.refresh();
                break;
            }
            case "get_remaining_room_time": { // timer fired (can be pushed into model)
                let remaining : number = message.remaining;
                const model = produce(store.getValue(), draft => {
                    draft.remaining = remaining;
                });
                store.next(model);
                //const x = roomService.getRoom(null);
                this.refresh();
                break;
            }
            case "new_ideas_in_room": { // notification from backend about new "idea"
                console.log("new_ideas_in_room");
                //this.socketStatus = 'new ideas';
                const model = store.getValue()
                if (model.activeRoomId) {
                    try {
                        const room = model.rooms.filter(room => room.roomId === this.roomId)[0];
                        if (room.type === "morphologicalroom") {
                            const z = morphoService.getParameterForRoom(this.roomId);
                            const y = morphoService.getCombinationsForRoom(this.roomId);
                        }
                        else {
                            const x = ideaService.getIdeasByRoomId(this.roomId);
                        }
                    }
                    catch(error) {
                        console.log(error);
                        console.log("error while new ideas in sockets")
                    }
                }
                this.refresh();
                break;
            }
            default: {
                console.log('Received default message:', message);
                //add idea to store
                const model = produce(store.getValue(), draft => {
                    const idea: Idea = {
                        roomId: draft.activeRoomId,
                        memberId: "other User",
                        content: message.message
                    }
                    draft.ideas.push(idea);
                });
                store.next(model);
            }
        }
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        RoomManagerSocketService.socketService = this;
    }

    

    setRoomId(roomId : string | null) : boolean {
        let oldRoomId : string|null = this.roomId;
        this.roomId = roomId;
        if (this.roomId) {
            if (this.roomId.length==0) {
                this.roomId=null;
            }
        }
        if (this.roomId && oldRoomId) {
            return (!(this.roomId === oldRoomId));
        }
        return (!(oldRoomId && this.roomId));
    }
    setUserId(userId : string | null) : boolean {
        let oldUserId : string | null = this.userId;
        this.userId = userId;
        if (this.userId) {
            if (this.userId.length==0) {
                this.userId=null;
            }
        }
        if (this.userId && oldUserId) {
            return (!(this.userId===oldUserId));
        }
        return (!(oldUserId && this.userId));
    }

    public async setUserAndRoom(roomId: string | null, userId: string | null) {

        let roomChanged = this.setRoomId(roomId);
        let userChanged = this.setUserId(userId);

        // Set a property, triggering an update
        if ((roomChanged === false) && (userChanged === false)) {
            return "nothing to do";
        }

        // baba.
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.close();
            console.log("===> CLOSED EXISTING <<<");
        }

        this.socket = null;

        if (this.roomId && this.userId) {
            // keep the "this" pointer for onOpen... handlers later
            const roomChatContext : RoomManagerSocketService = this; // not to be mistaken with websocket inside

            // create websocket url
            let url = `ws://localhost:8080/rooms/join/${this.roomId}/${this.userId}`;
            this.socket = new WebSocket(url);
            this.refresh();

            this.socket.onopen = function (event: Event) {
                event.preventDefault();
                //console.log('WebSocket connection opened:', event);
                roomChatContext.pushMessage("Connected to server!");
                // Wait for the updateComplete promise to resolve
                roomChatContext.refresh();
            };
            this.socket.onmessage = function (ev: MessageEvent) {
                roomChatContext._handleWebSocketMessage(ev);
            };
            this.socket.onclose = function (event: Event) {
                event.preventDefault();
                //console.log('WebSocket connection closed:', event);
                roomChatContext.pushMessage("Connection to Server closed!");
                roomChatContext.refresh();
            };

            this.socket.onerror = function (error: Event) {
                error.preventDefault();
                console.error('WebSocket error:', error);
                roomChatContext.pushMessage("Error in connection to Server!");
                roomChatContext.refresh();
            };
        }
        // update members in room now
        const y = participationService.getParticipantsInRoom(null);
        // ...do other stuff...
        return 'done';
    }

    refresh() {
        render(this.template(), this.shadowRoot);
    }

    connectedCallback() {
        store.pipe(map( model => ({roomId : model.activeRoomId, userId : model.thisUserId}) ), distinctUntilChanged())
            .subscribe(roomAndUser => {
                if (this.roomId !== roomAndUser.roomId) {
                    // clear messages in new room
                    console.log(`clear now room:${this.roomId} instead:${roomAndUser.roomId}`);
                    this.socketStatus = [];
                }
                // now register user/room and create socket
                const x = this.setUserAndRoom(roomAndUser.roomId, roomAndUser.userId);
                render(this.template(), this.shadowRoot);
            });
    }

    template() {
        return html`
            <style>
                .popupmessage {
                    position: absolute;
                    top: 5vh;
                    right: 2vw;
                    width: 25vw;
                    height: fit-content;
                    background-color: white;
                    border-radius: 5px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    z-index: 10;
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: opacity 0.5s ease, transform 0.5s ease;
                }
    
                .popupmessage.show {
                    opacity: 1;
                    transform: translateY(0);
                }
    
                .popupmessage.fade-out {
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: opacity 0.5s ease, transform 0.5s ease;
                }
    
                .popupmessage::after {
                    content: "";
                    position: absolute;
                    top: -10px;
                    right: 10%;
                    transform: translateX(-50%);
                    border-width: 10px;
                    border-style: solid;
                    border-color: transparent transparent white transparent;
                }
    
                .popupmessage-content {
                    display: table;
                    align-items: left;
                    justify-content: space-between;
                    height: 100%;
                    padding: 10px;
                    box-sizing: border-box;
                }
            </style>
    
            <div
                class="popupmessage"
                id="popupmessage1"
                @click="${() => { this.clearMessages(); }}"
            >
                <div class="popupmessage-content">
                    ${
                        this.socketStatus.map(
                            (m: string) => html`<div>${m}</div><br>`
                        )
                    }
                </div>
            </div>
        `;
    }

    private pushMessage(message) {
        this.socketStatus.push(message);
        this.showPopup();
    }

    public static pushOneMessage(message) {
        if (RoomManagerSocketService.socketService) {
            RoomManagerSocketService.socketService.pushMessage(message);
        }
    }
    
    showPopup() {
        const popup = this.shadowRoot?.getElementById('popupmessage1');
        if (popup) {
            // Add the "show" class to make it visible
            popup.classList.remove('fade-out');
            popup.classList.add('show');

            // first clear last timeout
            if (this.timeOutSet) {
                window.clearTimeout(this.timeOutSet);
            }

            let callerThis = this;
            // Remove the "show" class after a delay and add "fade-out"
            this.timeOutSet = window.setTimeout(() => {
                popup.classList.remove('show');
                //popup.classList.add('fade-out');
                callerThis.timeOutSet = null;
            }, 5000); // Display for 3 seconds
        }
    }
    
    clearMessages() {
        // first clear last timeout
        if (this.timeOutSet) {
            window.clearTimeout(this.timeOutSet);
        }
        this.socketStatus = []; // Clear messages
        const popup = this.shadowRoot?.getElementById('popupmessage1');
        if (popup) {
            popup.classList.remove('show', 'fade-out'); // Reset classes
        }
    }
    
}


customElements.define("idea-socket-service", RoomManagerSocketService)
export default RoomManagerSocketService;
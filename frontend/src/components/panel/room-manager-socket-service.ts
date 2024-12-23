import {html, render} from 'lit-html';
import {Idea, Model, Room, store} from "../../model";
import {produce} from "immer";
import {distinctUntilChanged, map} from "rxjs";
import roomService from "../../service/room-service";
import ideaService from "../../service/idea-service";
import participationService from "../../service/participation-service";
import mbparameterService from "../../service/morpho-service";
import morphoService from "../../service/morpho-service";

class RoomManagerSocketService extends HTMLElement {

    protected roomId: string | null = null;
    protected userId: string | null = null;
    protected socket: WebSocket | null = null;

    protected socketStatus: string = "not created";

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
            case "room_changed": // new response_type when admin changes desc/name
            case "room_notification": {
                this.socketStatus = `got room nfctn (${message.response_type}): "${message.message}"`;
                const y = participationService.getParticipantsInRoom(null);
                const x = roomService.getRoom(null);
                this.refresh();
                break;
            }
            case "get_remaining_room_time": { // timer fired (can be pushed into model)
                this.socketStatus = `got room timer: "${message.remaining}"`;
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
                //console.log("new_ideas_in_room");
                this.socketStatus = 'new ideas';
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
            this.socketStatus = "not created";
        }

        this.socket = null;

        if (this.roomId && this.userId) {
            // keep the "this" pointer for onOpen... handlers later
            const roomChatContext : RoomManagerSocketService = this; // not to be mistaken with websocket inside

            // create websocket url
            let url = `ws://localhost:8080/rooms/join/${this.roomId}/${this.userId}`;
            this.socket = new WebSocket(url);
            this.socketStatus = "created";
            this.refresh();

            this.socket.onopen = function (event: Event) {
                event.preventDefault();
                //console.log('WebSocket connection opened:', event);
                roomChatContext.socketStatus = "opened";
                // Wait for the updateComplete promise to resolve
                roomChatContext.refresh();
            };
            this.socket.onmessage = function (ev: MessageEvent) {
                roomChatContext._handleWebSocketMessage(ev);
            };
            this.socket.onclose = function (event: Event) {
                event.preventDefault();
                //console.log('WebSocket connection closed:', event);
                roomChatContext.socketStatus = "closed";
                roomChatContext.refresh();
            };

            this.socket.onerror = function (error: Event) {
                error.preventDefault();
                console.error('WebSocket error:', error);
                roomChatContext.socketStatus = "error";
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
    // not needed
    // dispatch the received button click as a "join-the-room" event
    // private async _sendMessage() {
    //     let message: string = '';
    //     if (this.shadowRoot) {
    //         const ttt = this.shadowRoot.getElementById(
    //             'message-text',
    //         ) as HTMLInputElement;
    //         message = ttt.value.trim();
    //         ttt.value = ''; // reset input
    //     }
    //     if (message.length > 0) {
    //         this.sendMessageToServer(message);
    //         // and delete message from input
    //     } else {
    //         console.log('nothing to send! ...' + message);
    //         //this.sendMessageToServer("nothing to send!"); // fake message for test
    //     }
    // }
    connectedCallback() {
        store.pipe(map( model => [model.activeRoomId, model.thisUserId] ), distinctUntilChanged())
            .subscribe(roomAndUser => {
                const x = this.setUserAndRoom(roomAndUser[0], roomAndUser[1]);
                render(this.template(), this.shadowRoot);
            });
    }

    template() {
        return html`
      <div>
        <!--<p>Socket-Status ${this.socketStatus}</p>-->
      </div>
    `;
    }
}


customElements.define("idea-socket-service", RoomManagerSocketService)
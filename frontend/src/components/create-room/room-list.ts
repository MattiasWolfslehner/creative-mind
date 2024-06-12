import { html, render } from "lit-html"
import { store } from "../../model"
import {Model, Room} from "src/model"
import {produce} from "immer";
import roomService from "../../service/room-service";
import {router} from "../../../router";
import {distinctUntilChanged, map} from "rxjs";


class RoomList extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({ mode: "open" });
    }

    template(rooms: Room[], userId:String) {
        const roomTemplates = rooms.filter(room => room.adminId === userId).map((room : Room) => html`
        <tr>
            <td>${room.roomId}</td>
            <td>${room.name}</td>
            <td>${room.description}</td>
            <td>${room.roomState}</td>
            <td>${room.type}</td>
        <td>
            <!--                     .hidden = ${!["OPEN", "CREATED"].includes(room.roomState)} -->
            <div id="${room.roomId}"   @click="${() => this._roomJoined(room.roomId)}"
                 style="background-color: white; height: auto;
                 ${(!["OPEN", "CREATED"].includes(room.roomState)?"":"display: flex;")} flex-wrap: wrap; justify-content: space-around; text-align: center; 
                 font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px; cursor:pointer">
            <p style="user-select: none;color:#000;padding: 10px">Join</p>
            </div>
        </td>
        </tr>
        `);
        return html`
        <style>
            
            h1 {
                font-size: 1.5em;
                font-family: sans-serif;
                color: white;
                text-align: center;
                margin-bottom: 20px;
            }

            table{
                border-spacing: 30px;
            }

            th {   
                font-size: 1em;
                font-family: sans-serif;    
                color: white;
                margin-bottom: 10px;
            }


            tr{
                font-size: 1em;
                font-family: sans-serif;    
                color: white;
                margin-bottom: 10px;
                text-align: center;
            }

            tr td:last-child {
                white-space: nowrap;
            }
        </style>

        <h1>Room List</h1>
        <table>
            <thead>
            <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Description</th>
                <th>State</th>
                <th>Type</th>
                <th>Join</th>
            </tr>
            </thead>
            <tbody>
            ${roomTemplates}
            </tbody>
        </table>
        
        <div id="showRoomButton"
             style="background-color: white; width: 20vw; height: auto; margin-top: 5vw;
             display: flex; flex-wrap: wrap; justify-content: space-around; text-align: center; 
                font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px; cursor:pointer">
            <h2 style="user-select: none">Show Create Room</h2>
        </div>
        `;
    }

    connectedCallback() {
        store.pipe(map( model => ({'userId': model.thisUserId, 'rooms': model.rooms}) ),distinctUntilChanged())
            .subscribe(model_values => {
                render(this.template(model_values.rooms, model_values.userId), this.shadowRoot)
            });

        this.addClickEventListeners();
    }
    private addClickEventListeners(): void {
        const showRoomButton = this.shadowRoot.getElementById('showRoomButton');
        showRoomButton.addEventListener('click', () => {
            const model = produce(store.getValue(), draft => {
                draft.isRoomList = false;
                draft.activeRoomId = "";
            });
            store.next(model);
        });
    }
    private async _roomJoined(_roomId: string) {
        console.log(`Joining room with room id: ${_roomId}<`);
        /** 
        roomService.getRoom(_roomId).then(value => {
            const model = produce(store.getValue(), draft => {
                //draft.rooms.push(value);
                draft.activeRoomId = value.roomId;
            });
            store.next(model);
        
            router.navigate(`/room/${value.roomId}`);
        });
        */
       router.navigate(`/room/${_roomId}`)

    }

}

customElements.define("room-list", RoomList)
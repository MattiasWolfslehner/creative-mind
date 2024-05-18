import { html, render } from "lit-html"
import { store } from "../../model"
import {Model, Room} from "src/model"
import {produce} from "immer";
import roomService from "../../service/room-service";
import {router} from "../../../router";


class RoomList extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({ mode: "open" });
    }

    template(model: Model) {
        const roomTemplates = model.rooms.map(room => html`
        <tr>
        <td>${room.roomId}</td>
        <td>${room.roomState}</td>
        <td>${room.type}</td>
        <td>
            <div id="${room.roomId}"  .hidden = ${!["OPEN", "CREATED"].includes(room.roomState)} @click="${() => this._roomJoined(room.roomId)}"
                 style="background-color: white; width: 20vw; height: auto; 
                 ${(!["OPEN", "CREATED"].includes(room.roomState)?"":"display: flex;")} flex-wrap: wrap; justify-content: space-around; text-align: center; 
                 font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px; cursor:pointer">
            <h2 style="user-select: none">Join</h2>
            </div>
        </td>
        </tr>
        `);
        return html`
        <h1>Room List</h1>
        <table>
            <thead>
            <tr>
                <th>Id</th>
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
        store.subscribe(model => {
            //console.log(model);
            render(this.template(model), this.shadowRoot)
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
        roomService.getRoom(_roomId).then(value => {
            const model = produce(store.getValue(), draft => {
                //draft.rooms.push(value);
                draft.activeRoomId = value.roomId;
            });
            store.next(model);

            router.navigate(`/room/${value.roomId}`);
        });
    }

}

customElements.define("room-list", RoomList)
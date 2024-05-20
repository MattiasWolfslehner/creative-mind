import { html, render } from "lit-html";
import "../create-room/create-room"
import "../create-room/room-list"
import "../room/statefullroom"
import "./idea-socket-service"
import { store } from "../../model"
import { distinctUntilChanged, map } from "rxjs";


const template = (isInRoom : boolean, isRoomList : boolean)=> html`
    <div>
        <create-room ?hidden = ${(isInRoom || isRoomList)} ></create-room>
        <room-list ?hidden = ${(isInRoom || !isRoomList)} ></room-list>
        <state-full-room ?hidden = ${!isInRoom} ></state-full-room>
        <idea-socket-service></idea-socket-service>
    </div>
`;

class PanelComponent extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode:"open"});
    }

    connectedCallback() {
        store.pipe(
            map( model => ({
                activeRoomId: model.activeRoomId,
                isRoomList: model.isRoomList
            })),distinctUntilChanged())
        .subscribe(reduced_model => {
            render(template(reduced_model.activeRoomId.length!=0, reduced_model.isRoomList), this.shadowRoot)
        });
    }
}

customElements.define("panel-component", PanelComponent);
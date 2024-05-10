import { html, render } from "lit-html";
import "../create-room/create-room"
import "../create-room/room-list"
import "../room/statefullroom"
import { store } from "../../model"
import { distinctUntilChanged, map } from "rxjs";


const template = (isInRoom : boolean, isRoomList : boolean)=> html`
    <div>
        <create-room ?hidden = ${(isInRoom || isRoomList)} ></create-room>
        <room-list ?hidden = ${(isInRoom || !isRoomList)} ></room-list>
        <state-full-room ?hidden = ${!isInRoom} ></state-full-room>
       <!-- <state-full-room></state-full-room> -->
    </div>
`;

class PanelComponent extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode:"open"});
    }

    connectedCallback() {
        store.pipe(map( model => [model.activeRoomId.length!=0, model.isRoomList] ),distinctUntilChanged())
        .subscribe(roomDenominators => {
            render(template(roomDenominators[0], roomDenominators[1]), this.shadowRoot)
        });
    }
}

customElements.define("panel-component", PanelComponent);
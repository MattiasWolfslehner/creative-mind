import { html, render } from "lit-html";
import "../create-room/create-room"
import "../room/statefullroom"
import { store } from "../../model"
import { distinctUntilChanged, map } from "rxjs";


const template = (isInRoom : boolean)=> html`
    <div>
        <create-room ?hidden = ${isInRoom} ></create-room>
        <state-full-room ?hidden = ${!isInRoom} ></state-full-room>
    </div>
`;

class PanelComponent extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode:"open"})
    }

    connectedCallback() {
        store.pipe(map( model => model.isInRoom ),distinctUntilChanged())
        .subscribe(isInRoom => {render(template(isInRoom), this.shadowRoot)})
    }
}

customElements.define("panel-component", PanelComponent)
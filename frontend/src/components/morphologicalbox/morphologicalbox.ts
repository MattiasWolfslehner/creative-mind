import { html, render } from "lit-html"
import "../custom-elements/roomInfoMenu"
import "../custom-elements/morphologicalBox"
import "../idea-room/participant-list"
import userService from "../../service/user-service"
import { store } from "../../model";
import { distinctUntilChanged, map } from "rxjs";


//attribute change callback
// html custom events for save
// mit lit

class MorphologicalBoxElement extends HTMLElement {

    template(roomId) {
        return html` 
            <div>
                    <room-info-menu></room-info-menu>
                    <div style="margin-top: 20vh">
                    <morphological-box style="font-family: 'sans-serif'"></morphological-box>
                    </div>
            </div>
        `;
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        // loads data
        const users = userService.getUsers();
    }

    connectedCallback() {
        const users = userService.getUsers();
        store.pipe(map(model => model.activeRoomId), distinctUntilChanged())
            .subscribe(activeRoomId => {
                render(this.template(activeRoomId), this.shadowRoot)
            });
    }
}


customElements.define("morphologicalbox-element", MorphologicalBoxElement)
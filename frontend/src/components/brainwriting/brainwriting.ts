import { html, render } from "lit-html"
import "./text-input"
import "./idea-list"
import "./room-list"
import ideaService from "../../service/idea-service"
import roomService from "../../service/room-list-service"

const template = ()=> html`
<div style="display: flex; justify-content: space-around">
    <div>
        <idea-list></idea-list>
        <text-input></text-input>
    </div>
    <div>
        <room-list></room-list>
    </div>
</div>
`

//attribute change callback
// html custom events for save
// mit lit

class BrainwritingElement extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode:"open"})
        const todos = ideaService.getIdeasByRoomId("814ae007-7f76-4260-960b-bf7b39b46d30");
        const rooms = roomService.getRooms();
    }

    connectedCallback() {
        console.log("connected")
        render(template(), this.shadowRoot)
    }
}


customElements.define("brain-writing", BrainwritingElement)
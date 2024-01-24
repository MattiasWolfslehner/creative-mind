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
        <center><h1>Room-List</h1></center>
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
        const todos = ideaService.getIdeasByRoomId("5169be8c-4b13-4760-8fad-9a81e1ba240d");
        const rooms = roomService.getRooms();
    }

    connectedCallback() {
        console.log("connected")
        render(template(), this.shadowRoot)
    }
}


customElements.define("brain-writing", BrainwritingElement)
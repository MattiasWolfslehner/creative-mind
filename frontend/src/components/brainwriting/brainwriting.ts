import { html, render } from "lit-html"
import "./text-input"
import "./idea-list"
import "./room-list"
import "./user-list"
import ideaService from "../../service/idea-service"
import roomService from "../../service/room-service"
import userService from "../../service/user-service"

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
    <div>
        <center><h1>User-List</h1></center>
        <user-list></user-list>
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
        const ideas = ideaService.getIdeasByRoomId("d1a576b9-df50-4132-8269-1d8dd72ab288");
        const rooms = roomService.getRooms();
        const users = userService.getUsers();
    }

    connectedCallback() {
        console.log("connected")
        render(template(), this.shadowRoot)
    }
}


customElements.define("brainwriting", BrainwritingElement)
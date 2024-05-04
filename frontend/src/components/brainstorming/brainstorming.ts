import { html, render } from "lit-html"
import "../brainwriting/text-input"
import "../brainwriting/idea-list"
import "../brainwriting/room-list"
import "../brainwriting/user-list"
import ideaService from "../../service/idea-service"
import roomService from "../../service/room-service"
import userService from "../../service/user-service"

const template = (roomId)=> html`
<div>
    <h1>BRAINSTORMING for ${roomId}</h1>
    <div>
        <idea-list></idea-list>
        <text-input></text-input>
    </div>
    <!--<div>
        <center><h1>Room-List</h1></center>
        <room-list></room-list>
    </div>-->
    <div>
        <center><h1>User-List</h1></center>
        <user-list></user-list>
    </div>
</div>
`

//attribute change callback
// html custom events for save
// mit lit

class BrainstormingElement extends HTMLElement {

    roomId : string = 'cb747ba6-88b7-4260-b5ea-45c72bafa299';

    static properties = {
        roomId: { type: String }
    }

    constructor() {
        super()
        this.attachShadow({mode:"open"});
        const ideas = ideaService.getIdeasByRoomId(this.roomId);
        const rooms = roomService.getRooms();
        const users = userService.getUsers();
    }

    connectedCallback() {
        console.log(`connected roomId in BrainstormingElement ${this.roomId}`)
        render(template(this.roomId), this.shadowRoot)
    }
}


customElements.define("brainstorming-element", BrainstormingElement)
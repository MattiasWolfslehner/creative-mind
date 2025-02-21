import { html, render } from "lit-html"
import "../idea-room/text-input"
import "../idea-room/room-input"
import "../idea-room/idea-list"
import "../idea-room/participant-list"
import ideaService from "../../service/idea-service"
import roomService from "../../service/room-service"
import userService from "../../service/user-service"
import {store} from "../../model";
import {distinctUntilChanged, map} from "rxjs";


//attribute change callback
// html custom events for save
// mit lit

class BrainwritingElement extends HTMLElement {

    template (roomId) {
        return html` 
            <div style="margin-top: 20vh">
                <div style="width: 70vw; margin-left: 2vw; ">
                    <h2>6-3-5 - Brainwriting Room</h2>
                    <p>You will not see the ideas of others as long as room is started, as soon as room ended you can read them.</p>
                </div>
                    <room-input></room-input>
                    <idea-list></idea-list>
                    <text-input></text-input>
                    <participant-list></participant-list>
            </div>
        `;
    }

    constructor() {
        super();
        this.attachShadow({mode:"open"});
        // loads data
        //const ideas = ideaService.getIdeasByRoomId(this.roomid);
        //const rooms = roomService.getRooms();
        const users = userService.getUsers();
    }

    connectedCallback() {
        //const ideas = ideaService.getIdeasByRoomId(this.roomId);
        //const rooms = roomService.getRooms();
        const users = userService.getUsers();
        store.pipe(map( model => model.activeRoomId ), distinctUntilChanged())
            .subscribe(activeRoomId => {
                render(this.template(activeRoomId), this.shadowRoot)
            });
    }
}


customElements.define("brainwriting-element", BrainwritingElement)
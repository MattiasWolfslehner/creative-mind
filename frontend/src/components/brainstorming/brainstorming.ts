import { html, render } from "lit-html"
import "../brainwriting/text-input"
import "../brainwriting/idea-list"
import "../brainwriting/user-list"
import ideaService from "../../service/idea-service"
import roomService from "../../service/room-service"
import userService from "../../service/user-service"
import {store} from "../../model";
import {distinctUntilChanged, map} from "rxjs";




class BrainstormingElement extends HTMLElement {

    template (roomId:string) {
        return html` 
            <div>
                <h1>BRAINSTORMING for ${roomId}</h1>
                <div>
                    <idea-list></idea-list>
                    <text-input></text-input>
                </div>
                <div>
                    <user-list></user-list>
                </div>
            </div>
            `;
    }


    constructor() {
        super();
        this.attachShadow({mode:"open"});
        // const ideas = ideaService.getIdeasByRoomId(this.roomid);
        // const rooms = roomService.getRooms();
        const users = userService.getUsers();
    }

    connectedCallback() {
        console.log(`connected roomId in BrainstormingElement`);
        // const ideas = ideaService.getIdeasByRoomId(this.roomid);
        // const rooms = roomService.getRooms();
        const users = userService.getUsers();
        store.pipe(map( model => model.activeRoomId ), distinctUntilChanged())
            .subscribe(activeRoomId => {
                render(this.template(activeRoomId), this.shadowRoot)
            });
    }
}

customElements.define("brainstorming-element", BrainstormingElement)
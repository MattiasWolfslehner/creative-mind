import { html, render } from "lit-html"
import "../idea-room/text-input"
import "../idea-room/room-input"
import "../idea-room/idea-list"
import "../idea-room/user-list"
import ideaService from "../../service/idea-service"
import roomService from "../../service/room-service"
import userService from "../../service/user-service"
import {store} from "../../model";
import {distinctUntilChanged, map} from "rxjs";




class BrainstormingElement extends HTMLElement {

    template (roomId:string) {
        return html` 
            <div>
                <div>
                    <room-input></room-input>
                    <idea-list></idea-list>
                    <text-input></text-input>
                    <participant-list></participant-list>
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
import { html, render, nothing } from "lit-html";
import {router} from "../../../router";
import {Room, store} from "../../model";
import roomService from "../../service/room-service";
import ideaService from "../../service/idea-service";
import {produce} from "immer";
import "../brainwriting/brainwriting"
import "../brainstorming/brainstorming"


class StatefullRoom extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode:"open"});
    }

    roomId : string = "";

    template (roomType:string, roomId:string, userId:string) {
        return html ` <!-- Room ${roomId} User ${userId} -->
            ${(roomType === "brainwritingroom") ? 
                    html ` <brainwriting-element></brainwriting-element>` : nothing }
            ${(roomType === "brainstormingroom") ? 
                    html ` <brainstorming-element></brainstorming-element>` : nothing }  
            ${(roomType === "otherroom") ? html `
                <p>otherroom</p>
            ` : nothing }
            ${(roomType === "yetanotherroom") ? html `
                <p>yetanotherroom</p>
            ` : nothing }
            `;
    }

    connectedCallback() {
        console.log("connected");
        
        //var roomId = null;

        //http://localhost:9000/#/room/5
        router.on('/room/:roomId', ({data}) => {
            //console.log(`route: `, data.roomId);
            let idxOfSign = data.roomId.indexOf("&");
            if (idxOfSign<0) {
                idxOfSign = data.roomId.indexOf("?");
            }
            if (idxOfSign<0) {
                idxOfSign = data.roomId.length;
            }
            this.roomId = data.roomId.substring(0,idxOfSign);
            var roomType = '';

            const room: Promise<void | Room> = roomService.getRoom(this.roomId).then(value => {
                const model = produce(store.getValue(), draft => {
                    draft.activeRoomId = value.roomId;
                });
                store.next(model);
            });

            // load ideas for rooms
            const ideas = ideaService.getIdeasByRoomId(this.roomId);

            // get Room from store
            store.subscribe(model => {
                //console.log('model:',model);
                const room = model.rooms.find(r => r.roomId === this.roomId);
                if (room) {
                    roomType = room.type;
                } else {
                    roomType = 'NoRoomType';
                }

                render(this.template(roomType, this.roomId, model.thisUserId), this.shadowRoot);
            })
        
        });

    }    
}

customElements.define("state-full-room", StatefullRoom);
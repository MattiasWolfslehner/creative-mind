import { html, render, nothing } from "lit-html";
import {router} from "../../../router";
import {Room, store} from "../../model";
import roomService from "../../service/room-service";
import ideaService from "../../service/idea-service";
import {produce} from "immer";
import "../brainwriting/brainwriting"
import "../brainstorming/brainstorming"
import {distinctUntilChanged, map} from "rxjs";


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
        router.on('/room/:roomId', ({data}) => {
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
            store.pipe(map(model => ({rooms: model.rooms, thisUserId: model.thisUserId})),distinctUntilChanged())
                .subscribe(reduced_model => {
                console.log('model in statefullroom:', reduced_model);
                const room = reduced_model.rooms.find(r => r.roomId === this.roomId);
                if (room) {
                    roomType = room.type;
                } else {
                    roomType = 'NoRoomType';
                }

                render(this.template(roomType, this.roomId, reduced_model.thisUserId), this.shadowRoot);
            });
        
        });

    }    
}

customElements.define("state-full-room", StatefullRoom);
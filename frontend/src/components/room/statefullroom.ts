import { html, render, nothing } from "lit-html";
import { router } from "../../../router";
import { Room, store } from "../../model";
import roomService from "../../service/room-service";
import ideaService from "../../service/idea-service";
import { produce } from "immer";
import "../brainwriting/brainwriting"
import "../brainstorming/brainstorming"
import "../morphologicalbox/morphologicalbox"
<<<<<<< Updated upstream
import {distinctUntilChanged, map} from "rxjs";
=======
import { distinctUntilChanged, map } from "rxjs";
>>>>>>> Stashed changes
import morphoService from "../../service/morpho-service";


class StatefullRoom extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    roomId: string = "";

    template(roomType: string, roomId: string, userId: string) {
        return html` <!-- Room ${roomId} User ${userId} -->
            ${(roomType === "brainwritingroom") ?
                html` <brainwriting-element></brainwriting-element>` : nothing}
            ${(roomType === "brainstormingroom") ?
                html` <brainstorming-element></brainstorming-element>` : nothing}
            ${(roomType === "morphologicalroom") ?
                html` <morphologicalbox-element></morphologicalbox-element>` : nothing}  
            ${(roomType === "otherroom") ? html`
                <p>otherroom</p>
            ` : nothing}
            ${(roomType) ? nothing :
                html`
                <p>NO ROOM Found</p>
                `}
            `;
    }

    connectedCallback() {
        router.on('/room/:roomId', ({ data }) => {
            let idxOfSign = data.roomId.indexOf("&");
            if (idxOfSign < 0) {
                idxOfSign = data.roomId.indexOf("?");
            }
            if (idxOfSign < 0) {
                idxOfSign = data.roomId.length;
            }
<<<<<<< Updated upstream
            this.roomId = data.roomId.substring(0,idxOfSign);
=======
            this.roomId = data.roomId.substring(0, idxOfSign);
            var roomType = '';
>>>>>>> Stashed changes

            const room: Promise<void | Room> = roomService.getRoom(this.roomId).then(value => {
                const model = produce(store.getValue(), draft => {
                    if (value) {
                        draft.activeRoomId = value.roomId;
                    }
                    else {
                        draft.activeRoomId = '';
                        draft.parameters = [];
                        draft.ideas = [];
                    }
                });
                store.next(model);
            });

            if (this.roomId) {
<<<<<<< Updated upstream
                // load ideas for rooms initially
                const ideas = ideaService.getIdeasByRoomId(this.roomId);
                const p = morphoService.getParameterForRoom(this.roomId);
                const c = morphoService.getCombinationsForRoom(this.roomId);
            }
        });


        var roomType = '';
        // get Room from store
        store.pipe(map(model => ({rooms: model.rooms, thisUserId: model.thisUserId})), distinctUntilChanged())
            .subscribe(reduced_model => {
                //console.log('model in statefullroom:', this.roomId);
                const room = reduced_model.rooms.find(r => r.roomId === this.roomId);
                if (room) {
                    roomType = room.type;
                } else {
                    roomType = '';
                }

                render(this.template(roomType, this.roomId, reduced_model.thisUserId), this.shadowRoot);
            });
    }    
=======
                // get Room from store
                store.pipe(map(model => ({ rooms: model.rooms, thisUserId: model.thisUserId })), distinctUntilChanged())
                    .subscribe(reduced_model => {
                        //console.log('model in statefullroom:', this.roomId);
                        const room = reduced_model.rooms.find(r => r.roomId === this.roomId);
                        if (room) {
                            roomType = room.type;
                            if (roomType == 'morphologicalroom') {
                                
                                morphoService.getParameterForRoom(this.roomId)
                            } else {
                                // load ideas for rooms
                                const ideas = ideaService.getIdeasByRoomId(this.roomId);
                            }
                        } else {
                            roomType = '';
                        }

                        render(this.template(roomType, this.roomId, reduced_model.thisUserId), this.shadowRoot);
                    });
            }
        });

    }
>>>>>>> Stashed changes
}

customElements.define("state-full-room", StatefullRoom);
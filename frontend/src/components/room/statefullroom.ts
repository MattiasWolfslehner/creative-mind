import { html, render, nothing } from "lit-html";
import {router} from "../../../router";
import {Room, store} from "../../model";
import roomService from "../../service/room-service";
import ideaService from "../../service/idea-service";
import {produce} from "immer";
import "../brainwriting/brainwriting"
import "../brainstorming/brainstorming"
import "../morphologicalbox/morphologicalbox"
import {distinctUntilChanged, map} from "rxjs";
import morphoService from "../../service/morpho-service";


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
            ${(roomType === "morphologicalroom") ?
            html ` <morphologicalbox-element></morphologicalbox-element>` : nothing }  
            ${(roomType === "otherroom") ? html `
                <p>otherroom</p>
            ` : nothing }
            ${(roomType) ? nothing :
            html `
                <p>NO ROOM Found</p>
                `}
            `;
    }

    protected static isUUID ( uuid:string ) {
        let s = "" + uuid;
        let x = s.match('^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');
        return x !== null;
    }

    connectedCallback() {
        router.on('/room/:roomId', ({data}) => {
            let oldRoomId = this.roomId;

            let idxOfSign = data.roomId.indexOf("&");
            if (idxOfSign<0) {
                idxOfSign = data.roomId.indexOf("?");
            }
            if (idxOfSign<0) {
                idxOfSign = data.roomId.length;
            }
            this.roomId = data.roomId.substring(0,idxOfSign);
            // check for uuid
            if (!StatefullRoom.isUUID(this.roomId)) {
                alert("room id is not correct (uuid)!");
                this.roomId = oldRoomId;
                router.navigate("/");
                return;
            }

            if (store.getValue().thisUserId) {
                console.log("logged in ... change room");
            } else {
                console.error("not logged in ... must log in first!");
                this.roomId = oldRoomId;
                alert("Please log in first!");
                router.navigate("/");
                return;
            }

            if (this.roomId) {
                const room: Promise<void | Room> = roomService.getRoom(this.roomId).then(value => {
                    const model = produce(store.getValue(), draft => {
                        if (value) {
                            draft.activeRoomId = value.roomId;
                        } else {
                            alert("Room Not Found!");
                            draft.activeRoomId = '';
                            draft.parameters = [];
                            draft.ideas = [];
                        }
                    });
                    store.next(model);
                });

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
}

customElements.define("state-full-room", StatefullRoom);
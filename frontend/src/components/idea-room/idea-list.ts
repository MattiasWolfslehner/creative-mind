import { html, render, nothing } from "lit-html";
import { store } from "../../model/store";
import { Idea, Model, Room } from "src/model";
import roomService from "../../service/room-service";
import ideaService from "../../service/idea-service";
import {distinctUntilChanged, map} from "rxjs";
import {Participation} from "../../model/participation";
import {router} from "../../../router";
import "../custom-elements/roomInfoMenu";

class IdeaList extends HTMLElement {
    roomState: string = "INVALID";
    roomType: string = "INVALID";

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    checkShowIdeaInRoom(idea: Idea, room: Room, userId: string): boolean {
        if (!room) {
            return false;
        }
        switch (room.type) {
            case "brainstormingroom": {
                // Everybody can see ideas in the room
                return idea.roomId === room.roomId;
            }
            case "brainwritingroom": {
                // Only see own ideas when started, others and own when stopped
                return (
                    idea.roomId === room.roomId &&
                    (idea.memberId === userId || room.roomState === "STOPPED")
                );
            }
            default:
                console.error("should never be here!");
                let x = 1 / 0;
        }
        return false;
    }

    getRandomColor() {
        const colors = ["#F06568", "#FFE76A", "#7EEDE5"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    getUserName(userId, participations: Participation[]) {
        let p = participations.filter(p => p.member.userId === userId)
        if (p.length > 0) {
            return (p[0].member.userName);
        }
        return ("Unknown");
    }

    template(ideas: Idea[], participations: Participation[], room: Room, userId: string) {
        const ideaTemplates = ideas.map((idea: Idea) =>
            this.checkShowIdeaInRoom(idea, room, userId)
                ? html`<div style="background-color: ${this.getRandomColor()};"><p>${idea.content}  \n <span style="font-size: smaller">(${this.getUserName(idea.memberId, participations)})</span></p></div>`
                : nothing
        );

        const adminId = room?room.adminId:"";

        return html`
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: #fff !important;
                }
                a {
                    color: #fff;
                    text-decoration: none;
                }
                .ideas {
                    display: grid;
                    gap: 4vh 2vw;
                    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
                    width: 96%;
                    margin-left: 2vw;
                    font-size: 1.2em;
                }
                .ideas > div {
                    height: 190px;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 10px 10px 6px rgba(0, 0, 0, 0.25);
                    padding: 10px;
                    text-align: center;
                }
            </style>
            
            <room-info-menu></room-info-menu>
            <div style="margin-left: 35vw; margin-top: 1vh; display: flex; flex-wrap: wrap">
                <div @click="${() => this.onStartRoom()}" .hidden="${adminId!=userId || (this.roomState === 'STARTED' || this.roomState === 'INVALID')}"
                     style="background-color: white; width: 15vw; height: auto; text-align: center;
                    font-family: 'sans-serif'; margin-top: 3vh; margin-bottom: 20px; border-radius: 10px; cursor:pointer">
                    <h2>Start</h2>
                </div>
                
                <div @click="${() => this.onStopRoom()}" .hidden="${adminId!=userId || this.roomState !== 'STARTED'}"
                     style="background-color: white; width: 15vw; height: auto; text-align: center;
                    font-family: 'sans-serif'; margin-top: 3vh; margin-bottom: 20px; border-radius: 10px; cursor:pointer">
                    <h2>Stop</h2>
                </div>
                
                <div @click="${() => {router.navigate("/");} }" .hidden="${this.roomState==="STARTED"}"
                     style="background-color: white; width: 15vw; height: auto; text-align: center;
                    font-family: 'sans-serif'; margin-top: 3vh; margin-left: 10px; margin-bottom: 20px; border-radius: 10px; cursor:pointer">
                    <h2>Leave</h2>
                </div>
            </div>
            <div class="ideas">
                ${ideaTemplates}
            </div>
        `;
    }

    connectedCallback() {
        store.pipe(map(model => ({
            ideas: model.ideas,
            rooms: model.rooms,
            participations: model.participations,
            activeRoomId: model.activeRoomId,
            thisUserId: model.thisUserId
        })),distinctUntilChanged())
            .subscribe(reduced_model => {
            const thisRooms = reduced_model.rooms.filter(
                (room) => room.roomId === reduced_model.activeRoomId
            );
            let thisRoom: Room = null;
            if (thisRooms.length == 1) {
                this.roomState = thisRooms[0].roomState;
                thisRoom = thisRooms[0];
            } else {
                this.roomState = "INVALID";
            }

            render(this.template(reduced_model.ideas, reduced_model.participations, thisRoom, reduced_model.thisUserId), this.shadowRoot);
        });
    }

    shareRoom() {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });        
    }
    onRefresh() {
        const model = store.getValue();
        const ideas = ideaService.getIdeasByRoomId(model.activeRoomId);
    }
    onStartRoom() {
        const model = store.getValue();
        const egal = roomService.startRoom(model.activeRoomId);
        const ideas = roomService.getRooms();
    }
    onStopRoom() {
        const model = store.getValue();
        const egal = roomService.stopRoom(model.activeRoomId);
        const ideas = roomService.getRooms();
    }
}

customElements.define("idea-list", IdeaList);

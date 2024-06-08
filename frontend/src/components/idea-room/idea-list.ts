import { html, render, nothing } from "lit-html";
import { store } from "../../model/store";
import { Idea, Model, Room } from "src/model";
import roomService from "../../service/room-service";
import ideaService from "../../service/idea-service";
import {distinctUntilChanged, map} from "rxjs";
import {Participation} from "../../model/participation";
import {router} from "../../../router";

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
                #roomInfo {
                    position: absolute;
                    top: 1vw;
                    left: 2vw;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 60vw;
                    height: 67px;
                    border-radius: 5px;
                    background-color: #8D63D0;
                    padding: 0 10px;
                    font-family: 'sans-serif';
                    color: white;
                }
                #roomInfo div {
                    padding: 0 1rem;
                }
                #roomMenu {
                    position: absolute;
                    top: 6vw;
                    left: 2vw;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 400px;
                    height: 67px;
                    border-radius: 5px;
                    background-color: #8D63D0;
                    padding: 0 10px;
                    box-sizing: border-box;
                    font-family: 'sans-serif';
                }        
                .menu-item {
                    display: flex;
                    align-items: center;
                }        
                .burger-menu {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    width: 40px;
                    height: 24px;
                    cursor: pointer;
                }
                .burger-menu div {
                    width: 100%;
                    height: 6px;
                    background-color: #fff;
                    border-radius: 2px;
                    margin: 5%;
                }
                .member-count {
                    width: 49px;
                    height: 49px;
                    border-radius: 50%;
                    background-color: #fff;
                    border: 3px solid #7A49C9;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.5em;
                }
                .share-box {
                    display: flex;
                    align-items: center;
                    width: 141px;
                    height: 48px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    padding: 0 10px;
                    box-sizing: border-box;
                    cursor:pointer;
                }        
                .share-box img {
                    width: 48px;
                    height: 48px;
                    border-radius: 5px;
                }        
                .share-box span {
                    margin-left: 10px;
                    font-size: 1.5em;
                    color: #000;
                }
                .tooltip {
                    visibility: hidden;
                    width: 140px;
                    background-color: #555;
                    color: #fff;
                    text-align: center;
                    border-radius: 5px;
                    padding: 5px;
                    position: absolute;
                    z-index: 1;
                    top: 120%;
                    left: 12vw;
                    transform: translateX(-50%);
                    opacity: 0;
                    transition: opacity 0.3s;
                    margin-top: 5px;
                }        
                .share-box:hover .tooltip {
                    visibility: visible;
                    opacity: 1;
                }        
                .tooltip::after {
                    content: "";
                    position: absolute;
                    top: -18%;
                    left: 4vw;
                    transform: translateX(-50%);
                    border-width: 5px;
                    border-style: solid;
                    border-color: transparent transparent #555 transparent;
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
            
            <div id="roomInfo">
                <div>
                    <h1 id="homeButtonId2">Creative Minds</h1>
                </div>
                <div>
                    <h2>|<h2>
                </div>
                <div>
                    <h2 id="roomName">${room?(room.name?room.name:"NONAME2"):"NONAME"}</h2>
                </div>
            </div>  
            <div id="roomMenu">
                <div class="menu-item burger-menu">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div class="menu-item member-count">
                    ${(participations)?(participations.length):0}
                </div>
                <div class="menu-item share-box" @click="${() => this.shareRoom()}">
                    <img src="https://png.pngtree.com/png-vector/20191004/ourmid/pngtree-person-icon-png-image_1788612.jpg" alt="Person Icon">
                    <span>Share</span>
                    <div class="tooltip">Copy link to clipboard</div>
                </div>
            </div>
            <div style="margin-left: 460px; margin-top: 1vh; display: flex; flex-wrap: wrap">
                <div @click="${() => this.onStartRoom()}" .hidden="${adminId!=userId || (this.roomState === 'STARTED' || this.roomState === 'INVALID')}"
                     style="background-color: white; width: 15vw; height: auto; text-align: center;
                    font-family: 'sans-serif'; margin-top: 3vh; margin-bottom: 20px; border-radius: 10px; cursor:pointer">
                    <h2>Start</h2>
                </div>
                
                <div @click="${() => this.onStopRoom()}" .hidden="${adminId!=userId || this.roomState !== 'STARTED'}"
                     style="background-color: white; width: 15vw; height: auto; text-align: center;
                    font-family: 'sans-serif'; margin-left: 10px; margin-top: 3vh; margin-bottom: 20px; border-radius: 10px; cursor:pointer">
                    <h2>Stop</h2>
                </div>
                
                <div @click="${() => {router.navigate("/");} }" .hidden="${this.roomState==="STARTED"}"
                     style="background-color: white; width: 15vw; height: auto; text-align: center;
                    font-family: 'sans-serif'; margin-top: 3vh; margin-left: 10px; margin-bottom: 20px; border-radius: 10px; cursor:pointer">
                    <h2>Leave</h2>
                </div>
                
                <div style="width: 15vw; height: auto; text-align: center;
                    font-family: 'sans-serif'; margin-top: 3vh; margin-left: 10px; margin-bottom: 20px; border-radius: 10px">
                    <h2>${(this.roomState==="STARTED")?("BE CREATIVE MIND."):"You are in the room now!"}</h2>
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

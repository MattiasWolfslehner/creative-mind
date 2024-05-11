import { html, render, nothing } from "lit-html"
import { store } from "../../model/store"
import {Idea, Model, Room} from "src/model"
import roomService from "../../service/room-service";
import ideaService from "../../service/idea-service";


class IdeaList extends HTMLElement {


    roomState : string = "INVALID";
    roomType : string = "INVALID";

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    checkShowIdeaInRoom(idea:Idea, room:Room, userId : string) : boolean {
        console.log(idea, room, userId);
        if (!room) {
            return false;
        }
        switch (room.type) {
            case "brainwritingroom": {
                return (idea.roomId === room.roomId);
            }
            case "brainstormingroom": {
                // only see my ideas when started, others and mine when stopped
                return ((idea.roomId === room.roomId) && ((idea.memberId === userId) || (room.roomState == "STOPPED")))
            }
            default:
                console.error("should never be here!");
                let x = 1/0;
        }
        return false;
    }

    template(model: Model, room:Room, userId:string) {
        const ideaTemplates = model.ideas.map( (idea : Idea) =>
                    html`${(this.checkShowIdeaInRoom(idea, room, userId))?
                        html`
                        <tr>
                            <td>${idea.memberId}</td>
                            <td>${idea.content}</td>
                        </tr>
                    `:nothing
        }`);
        return html`
            <!-- let's do some styling --> 
            <style> 
                .styled-table {
                    border-collapse: collapse;
                    margin: 25px 0;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
                }

                .styled-table td {
                    padding: 10px;
                }

                .styled-table thead td {
                    background-color: #54585d;
                    color: #ffffff;
                    font-weight: bold;
                    font-size: 13px;
                    border: 1px solid #dddfe1;
                }

                .styled-table tbody td {
                    border: 1px solid #dddfe1;
                }
            </style>
            <div style="margin-top: 1vh; display: flex; flex-wrap: wrap; justify-content: space-around">
                <h1>List of Ideas</h1>
                <div @click= "${() => this.onRefresh()}"
                     style="background-color: white; width: 15vw; height: auto; text-align: center;
                    font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px; cursor:pointer">
                    <h2>Refresh</h2>
                </div>
                <div @click= "${() => this.onStartRoom()}" .hidden="${((this.roomState==='STARTED')||(this.roomState==='INVALID'))}"
                     style="background-color: white; width: 15vw; height: auto; text-align: center;
                    font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px; cursor:pointer">
                    <h2>Start</h2>
                </div>
                <div @click= "${() => this.onStopRoom()}" .hidden="${((this.roomState!=='STARTED'))}"
                     style="background-color: white; width: 15vw; height: auto; text-align: center;
                    font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px; cursor:pointer">
                    <h2>Stop</h2>
                </div>
            </div>
            <table class="styled-table">
                <thead>
                <tr>
                    <td>User</td>
                    <td>Message</td>
                </tr>
                </thead>
                <tbody>
                    ${ideaTemplates}
                </tbody>
            </table>
            `;
    }

    connectedCallback() {
        store.subscribe(model => {
            //console.log(model);
            const thisRooms = model.rooms.filter((room)=> room.roomId===model.activeRoomId);
            //console.log(thisRoom);
            let thisRoom: Room = null;
            if (thisRooms.length==1){
                this.roomState = thisRooms[0].roomState;
                thisRoom = thisRooms[0];
            } else {
                this.roomState = "INVALID";
            }
            console.log(thisRooms, ":", this.roomState);

            render(this.template(model, thisRoom, model.thisUserId), this.shadowRoot)
        });
    }

    onRefresh () {
        const model = store.getValue();
        const ideas = ideaService.getIdeasByRoomId(model.activeRoomId);
    }
    onStartRoom () {
        const model = store.getValue();
        const egal = roomService.startRoom(model.activeRoomId);
        const ideas = roomService.getRooms();
    }
    onStopRoom () {
        const model = store.getValue();
        const egal = roomService.stopRoom(model.activeRoomId);
        const ideas = roomService.getRooms();
    }

}

customElements.define("idea-list", IdeaList)
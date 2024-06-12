import { html, render, nothing } from "lit-html"
import {Model, Room, store} from "../../model"
import {distinctUntilChanged, map} from "rxjs";
import roomService from "../../service/room-service";


class RoomInputElement extends HTMLElement {


    template(isInRoom:boolean, thisRoom:Room, isAdmin:boolean, remaining:number) {
        if (isInRoom == false) {
            return nothing;
        }
        return html`
        <style>
            body {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #fff !important;
            }
            .container {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                width: 100%;
                margin-top: 10vh;
            }
            .styled-input {
                width: 100%;
                max-width: 1070px;
                height: 60px;
                background-color: #8D63D0;
                color: #fff;
                border: 5px solid #9D75EF;
                box-sizing: border-box;
                font-size: 16px;
                padding: 0 10px;
                outline: none;
                margin-bottom: 20px;
                border-radius: 5px;
            }
            .send-button {
                background-color: white;
                width: 100%;
                max-width: 240px;
                height: auto;
                text-align: center;
                font-family: 'sans-serif';
                margin-bottom: 20px;
                border-radius: 10px;
                cursor: pointer;
            }
            .send-button h2 {
                user-select: none;
            }
            @media (max-width: 600px) {
                .styled-input {
                    font-size: 14px;
                    padding: 0 8px;
                }
            }
        </style>

        <div class="container">
            <div style="width: 70vw; margin-left: 2vw; ">
                <!-- <textarea name="textarea" id="area" cols="30" rows="10"></textarea> -->
                <input type="text" class="styled-input" id="room-name" .disabled="${(!(isAdmin))}" placeholder="" value="${thisRoom.name}">
                <input type="text" class="styled-input" id="room-description" .disabled="${(!(isAdmin))}" placeholder="a valueable description should be added by room admin" value="${thisRoom.description}">
            </div>
            <!-- does not work properly {((isRoomStarted && canAddIdeas)?"display: flex;":"")} flex-wrap: wrap;-->
            <div style="margin-left: 20px;">
                <div style="background-color: grey;
                        width: 15vw; height: 60px; text-align: center; margin-bottom: 20px;
                        font-family: 'sans-serif'; border-radius: 10px;">
                    <h2>Remaining: ${remaining?remaining:"not started"}</h2>
                </div>
                <div @click= "${() => this.onButtonClick()}" .hidden="${!isAdmin}" 
                     style="background-color: ${(isAdmin?"white":"grey")}; 
                     width: 15vw; height: 60px; text-align: center; margin-bottom: 20px;
                     font-family: 'sans-serif'; border-radius: 10px; cursor:pointer">
                    <h2 style="user-select: none">Update Description</h2>
                </div>
            </div>
        </div>
        `
    } 

    onButtonClick(){
        const name_element : HTMLInputElement = this.shadowRoot.querySelector('#room-name')
        const description_element : HTMLInputElement = this.shadowRoot.querySelector('#room-description')

        const name = name_element.value
        console.log(name);
        const description = description_element.value
        console.log(description);


        if (name !== "" || description !== "") {
            const model : Model = store.getValue();
            const activeRooms = model.rooms.filter(room => room.roomId === model.activeRoomId);
            if (activeRooms.length>0) { // can happen (no active room?)
                const r = activeRooms[0]
                // copy and make writeable
                let room = {...r};

                if (name !== "") {
                    room.name = name;
                }
                if (description !== "") {
                    room.description = description;
                }

                const x = roomService.updateRoom(room);
            }
        }
    }

    constructor(){
        super()
        this.attachShadow({mode:"open"})
    }

    connectedCallback() {
        store.pipe(map(model => ({
            activeRoom: model.rooms.filter(r => r.roomId === model.activeRoomId),
            activeRoomId: model.activeRoomId,
            thisUserId: model.thisUserId,
            remaining: model.remaining
        })),distinctUntilChanged())
            .subscribe(reduced_model => {
            //console.log(model);
            const thisRooms = reduced_model.activeRoom;
            let thisRoom: Room = null;
            let thisRoomStarted = false;
            let isAdmin : boolean = false;
            if (thisRooms.length==1){
                thisRoom = thisRooms[0];
                thisRoomStarted = (thisRoom.roomState==="STARTED");
                isAdmin = (reduced_model.thisUserId === thisRoom.adminId);
            }

            render(this.template(reduced_model.activeRoomId!=="", thisRoom, isAdmin,reduced_model.remaining), this.shadowRoot);
        });
    }

}

customElements.define("room-input", RoomInputElement);

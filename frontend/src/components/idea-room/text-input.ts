import { produce } from "immer";
import { html, render, nothing } from "lit-html"
import {Idea, Model, Room, store} from "../../model"
import ideaService from "../../service/idea-service"


class TextInputElement extends HTMLElement {


    template(isInRoom, isRoomStarted) {
        if (isInRoom == false) {
            return nothing;
        }
        return html`
        <div>
            <!-- <textarea name="textarea" id="area" cols="30" rows="10"></textarea> -->
            <input type="text" name="" .disabled="${(!isRoomStarted)}" placeholder="${(isRoomStarted?"enter new idea":"wait till room is started")}">
            <div @click= "${() => this.onButtonClick()}" .hidden="${!isRoomStarted}"
                 style="background-color: white; width: 20vw; height: auto; text-align: center; 
                 font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px; cursor:pointer">
                <h2 style="user-select: none">Send</h2>
        </div>
        `
    } 

    onButtonClick(){
        const input = this.shadowRoot.querySelector('input').value

        if (input !== "") {
            const model : Model = store.getValue();

            const idea : Idea = {
                roomId : model.activeRoomId,
                memberId: model.thisUserId,
                content: input
            }

            const newIdea = ideaService.postNewIdea(idea);
        }
    }

    constructor(){
        super()
        this.attachShadow({mode:"open"})
    }

    connectedCallback() {
        store.subscribe(model => {
            //console.log(model);
            const thisRooms = model.rooms.filter((room)=> room.roomId===model.activeRoomId);
            //console.log(thisRoom);
            let thisRoom: Room = null;
            let thisRoomStarted = false;
            if (thisRooms.length==1){
                thisRoom = thisRooms[0];
                thisRoomStarted = (thisRoom.roomState==="STARTED");
            }

            render(this.template(model.activeRoomId!=="", thisRoomStarted), this.shadowRoot);
        });
    }

}

customElements.define("text-input", TextInputElement)
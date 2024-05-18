import { html, render, nothing } from "lit-html"
import {Idea, Model, Room, store} from "../../model"
import ideaService from "../../service/idea-service"


class TextInputElement extends HTMLElement {


    template(isInRoom:boolean, isRoomStarted:boolean, canAddIdeas:boolean) {
        if (isInRoom == false) {
            return nothing;
        }
        return html`
        <div>
            <!-- <textarea name="textarea" id="area" cols="30" rows="10"></textarea> -->
            <input type="text" name="" .disabled="${(!(isRoomStarted && canAddIdeas))}" placeholder="${(isRoomStarted?(canAddIdeas?"enter new idea":"maximum number of ideas added"):"wait till room is started")}">
            <div @click= "${() => this.onButtonClick()}" .hidden="${!isRoomStarted}" 
                 style="background-color: ${(canAddIdeas?"white":"grey")}; width: 20vw; height: auto; 
                 <!-- does not work properly ${((isRoomStarted && canAddIdeas)?"display: flex;":"")} flex-wrap: wrap;--> justify-content: space-around; text-align: center; 
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

            this.shadowRoot.querySelector('input').value = "";
            const promise = ideaService.postNewIdea(idea);
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
            let canAddIdeas : boolean = false;
            if (thisRooms.length==1){
                thisRoom = thisRooms[0];
                thisRoomStarted = (thisRoom.roomState==="STARTED");

                let ideas_of_this_user = model.ideas.filter((idea)=> idea.memberId===model.thisUserId && idea.roomId===model.activeRoomId).length;
                switch (thisRoom.type) {
                    case "brainstormingroom":
                        canAddIdeas=true;
                        // nothing to do
                        break;

                    case "brainwritingroom": // permit only three ideas for user
                        canAddIdeas = ideas_of_this_user < 3;
                        break;

                    default:
                        break;
                }


            }

            render(this.template(model.activeRoomId!=="", thisRoomStarted, canAddIdeas), this.shadowRoot);
        });
    }

}

customElements.define("text-input", TextInputElement);

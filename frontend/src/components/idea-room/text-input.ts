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
                flex-direction: column;
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
                .send-button {
                    max-width: 100%;
                }
            }
        </style>

        <div class="container">
            <input type="text" class="styled-input" name="" .disabled="${(!isRoomStarted)}" placeholder="${(isRoomStarted ? 'your idea...' : 'wait until the room has started')}" @input="${this.onInput}">
            <div @click="${() => this.onButtonClick()}" class="send-button" .hidden="${!isRoomStarted}">
                <h2>Send</h2>
            </div>
        </div>
        `
    } 

    onInput(event) {
        const input = event.target.value;
        event.target.value = input.slice(0, 20);
    }

    onButtonClick(){
        const input = this.shadowRoot.querySelector('input').value

        if (input !== "") {
            const model : Model = store.getValue();

            const idea : Idea = {
                roomId: model.activeRoomId,
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
            const thisRooms = model.rooms.filter((room) => room.roomId === model.activeRoomId);
            //console.log(thisRoom);
            let thisRoom: Room = null;
            let thisRoomStarted = false;
            if (thisRooms.length == 1){
                thisRoom = thisRooms[0];
                thisRoomStarted = (thisRoom.roomState === "STARTED");
            }

            render(this.template(model.activeRoomId !== "", thisRoomStarted), this.shadowRoot);
        });
    }

}

customElements.define("text-input", TextInputElement)

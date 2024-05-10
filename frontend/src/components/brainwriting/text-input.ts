import { produce } from "immer";
import { html, render } from "lit-html"
import {Idea, Model, store} from "../../model"
import ideaService from "../../service/idea-service"


class TextInputElement extends HTMLElement {


    template() {
        return html`
        <div>
            <!-- <textarea name="textarea" id="area" cols="30" rows="10"></textarea> -->
            <input type="text" name="" placeholder="enter new idea">
            <div @click= "${() => this.onButtonClick()}"
                 style="background-color: white; width: 20vw; height: auto; text-align: center; 
                 font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px; cursor:pointer">
                <h2 style="user-select: none">Send</h2>
        </div>
        `
    } 

    onButtonClick(){
        console.log("button was clicked");
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
        console.log("connected")
        
        render(this.template(), this.shadowRoot)
    }

}

customElements.define("text-input", TextInputElement)
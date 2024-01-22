import { produce } from "immer";
import { html, render } from "lit-html"
import { Idea, store } from "../../model"
import ideaService from "../../service/idea-service"

class TextInputElement extends HTMLElement { 
    
    template() {
        return html`
        <div>
            <!-- <textarea name="textarea" id="area" cols="30" rows="10"></textarea> -->
            <input type="text" name="" placeholder="enter new idea">
            <div>
                <button type="button" @click= ${() => this.onButtonClick()}>send</button>
            </div>
        </div>
        `
    } 

    onButtonClick(){
        console.log("button was clicked");
        const input = this.shadowRoot.querySelector('input').value

    
        const idea : Idea = {  
            roomId : "100eafb1-32ca-4725-8d27-88560d0a9628",
            memberId: "6400e021-d369-44eb-9943-f51d0aae14db",
            content: input
        }

        ideaService.postNewIdea(idea);
             
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
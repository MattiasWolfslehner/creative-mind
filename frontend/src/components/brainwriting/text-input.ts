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
            roomId : "d1a576b9-df50-4132-8269-1d8dd72ab288",
            memberId: "9c199477-b2ed-4124-b885-985b68f30590",
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
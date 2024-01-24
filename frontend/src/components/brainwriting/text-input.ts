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
            roomId : "5169be8c-4b13-4760-8fad-9a81e1ba240d",
            memberId: "864c05ec-e20c-4307-9021-530b3c3f2a2c",
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
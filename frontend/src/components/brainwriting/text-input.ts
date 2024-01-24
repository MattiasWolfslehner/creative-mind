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
            roomId : "86d1ffdc-8c76-4f65-aaeb-73e4b5c175eb",
            memberId: "3adeabd2-0c67-487e-bb78-80b58db5f785",
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
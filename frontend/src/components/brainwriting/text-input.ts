import { produce } from "immer";
import { html, render } from "lit-html"
import { Todo, store } from "../../model"

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
        
        const todo : Todo = {
            userId: 0,
            id: 0,
            title: input,
            completed: false
        }

        const model = produce(store.getValue(), draft => {
            draft.todos.push(todo)
        })

        store.next(model)       
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
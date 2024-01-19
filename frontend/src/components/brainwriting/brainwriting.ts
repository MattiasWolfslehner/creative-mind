import { html, render } from "lit-html"
import "./text-input"
import "./idea-list"
import todoService from "../../service/todo-service"

const template = ()=> html`
<div style="display: flex; justify-content: space-around">
    <div>
        <idea-list></idea-list>
        <text-input></text-input>
    </div>
    <div>
        <room-list></room-list>
    </div>
</div>
`

//attribute change callback
// html custom events for save
// mit lit

class BrainwritingElement extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode:"open"})
        const todos = todoService.getAll()
    }

    connectedCallback() {
        console.log("connected")
        render(template(), this.shadowRoot)
    }
}


customElements.define("brain-writing", BrainwritingElement)
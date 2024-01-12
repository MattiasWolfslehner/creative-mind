import { html, render } from "lit-html"
import { store } from "../../model/store"
import { Model } from "src/model"

function template(model: Model) {
    const todoTemplates = model.todos.map(todo => html`
    <li>
        ${todo.title}: ${todo.id}
    </li> 

    `)
    return html`
        <table>
            <ul>
                ${todoTemplates}
            </ul>
        </table>
        `
}

class IdeaList extends HTMLElement {

    constructor() {
        super()

        this.attachShadow({ mode: "open" })
    }

    connectedCallback() {
        store.subscribe(model => {
            console.log(model);
            render(template(model), this.shadowRoot)
        })
    }

}

customElements.define("idea-list", IdeaList)
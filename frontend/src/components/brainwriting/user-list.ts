import { html, render } from "lit-html"
import { store } from "../../model/store"
import { Model } from "src/model"

function template(model: Model) {
    const userTemplates = model.users.map(user => html`
    <li>
        ${user.userId}
    </li> 

    `)
    return html`
        <table>
            <ul>
                ${userTemplates}
            </ul>
        </table>
        `
}

class UserList extends HTMLElement {

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

customElements.define("user-list", UserList)
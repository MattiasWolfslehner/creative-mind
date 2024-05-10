import { html, render } from "lit-html"
import { store } from "../../model/store"
import { Model } from "src/model"


class UserList extends HTMLElement {

    template(model: Model) {
        const userTemplates = model.users.map(user => html`
    <li>
        ${user.userId}
    </li> 

    `)
        return html`
            <h1>User List</h1>
        <table>
            <ul>
                ${userTemplates}
            </ul>
        </table>
        `;
    }

    constructor() {
        super();

        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        store.subscribe(model => {
            //console.log(model);
            render(this.template(model), this.shadowRoot);
        })
    }

}

customElements.define("user-list", UserList)
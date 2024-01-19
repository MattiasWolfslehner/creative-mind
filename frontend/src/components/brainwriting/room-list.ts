import { html, render } from "lit-html"
import { store } from "../../model/store"
import { Model } from "src/model"

function template(model: Model) {
    const roomTemplates = model.room.map(room => html`
    <li>
        ${room.roomId}: ${room.id}
    </li> 

    `)
    return html`
        <table>
            <ul>
                ${roomTemplates}
            </ul>
        </table>
        `
}

class RoomList extends HTMLElement {

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

customElements.define("room-list", RoomList)
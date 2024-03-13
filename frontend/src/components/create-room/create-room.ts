import { html, render } from "lit-html"
import "../brainwriting/text-input"
import "../brainwriting/user-list"
import "./creativity-technique"
import userService from "../../service/user-service"

const template = ()=> html`
<div style="display: flex; justify-content: center; flex-wrap: wrap">
    <div style="width: 65vw; text-align: center;">
        <h1 style="color: white; font-family: 'sans-serif'">Creativity Technique</h1>
        <hr style="border: 2px solid #8D63D0; width: 100%;">
        <creativity-technique></creativity-technique>
    </div>
    <div>
    </div>
</div>
`

class CreateRoomElement extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode:"open"})
        const users = userService.getUsers();
    }

    connectedCallback() {
        console.log("connected")
        render(template(), this.shadowRoot)
    }
}


customElements.define("create-room", CreateRoomElement)
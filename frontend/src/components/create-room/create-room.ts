import { html, render } from "lit-html"
import "./creativity-technique"
import "./create-room-button"
import "../../style/create-room/create-room-style.css"

const template = ()=> html`
<div id="mainBox" style="display: flex; justify-content: center; flex-wrap: wrap">
    <div id="smallerBox" style="width: 65vw; text-align: center;">
        <h1 style="margin-bottom: -0.5vh; color: white; font-family: 'sans-serif'">Creativity Technique</h1>
        <hr style="border: 2px solid #8D63D0; width: 100%;">
        <creativity-technique></creativity-technique>
    </div>
</div>
`

class CreateRoomElement extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode:"open"})
    }

    connectedCallback() {
        console.log("connected")
        render(template(), this.shadowRoot)
    }
}


customElements.define("create-room", CreateRoomElement)
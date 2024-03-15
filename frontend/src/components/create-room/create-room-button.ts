import { html, render } from "lit-html"

const template = ()=> html`
    <div style="margin-top: 30vh; display: flex; flex-wrap: wrap; justify-content: space-around;">
        <div id="createRoomButton" style="background-color: white; width: 20vw; height: auto; text-align: center; font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px">
            <h2>Create Room</h2>
        </div>
    </div>
`

class CreateRoomButtonElement extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode:"open"})
    }

    connectedCallback() {
        console.log("connected")
        render(template(), this.shadowRoot)
    }
}


customElements.define("create-room-button", CreateRoomButtonElement)
import { html, render } from "lit-html"
import "../brainwriting/text-input"

const template = ()=> html`
    <div id="creativityTechniques" style="margin-top: 3vh; display: flex; flex-wrap: wrap; justify-content: space-between;">
        <div id="sixThreeFive" style="background-color: #8D63D0; width: 20vw; height: auto; text-align: center; color: white; font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px">
            <h2>6-3-5</h2>
        </div>
        <div id="mindMap" style="background-color: #ffffff; width: 20vw; height: auto; text-align: center; color: black; font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px">
            <h2>MindMap</h2>
        </div>
        <div id="zwickyBox" style="background-color: #ffffff; width: 20vw; height: auto; text-align: center; color: black; font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px">
            <h2>Zwicky-Box</h2>
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


customElements.define("creativity-technique", CreateRoomElement)
import { html, render } from "lit-html"
import "../../style/create-room/creativity-technique-style.css"

const template = ()=> html`
    <div id="creativityTechniques" style="margin-top: 3vh; display: flex; flex-wrap: wrap; justify-content: space-around;">
        <div id="sixThreeFive" style="background-color: rgba(141, 99, 208, 0.4); width: 20vw; height: auto; text-align: center; color: rgba(255, 255, 255, 0.4); font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px">
            <h2>6-3-5</h2>
        </div>
        <div id="mindMap" style="background-color: rgba(141, 99, 208, 0.4); width: 20vw; height: auto; text-align: center; color: rgba(255, 255, 255, 0.4); font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px">
            <h2>MindMap</h2>
        </div>
        <div id="zwickyBox" style="background-color: rgba(141, 99, 208, 0.4); width: 20vw; height: auto; text-align: center; color: rgba(255, 255, 255, 0.4); font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px">
            <h2>Zwicky-Box</h2>
        </div>
        <div id="brainstorm" style="background-color: #8D63D0; width: 20vw; height: auto; text-align: center; color: white; font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px">
            <h2>Brainstorm</h2>
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
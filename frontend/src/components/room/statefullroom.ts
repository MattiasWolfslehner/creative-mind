import { html, render } from "lit-html"

const template = ()=> html `
<h1>here comes the right view for the room type</h1>
`

class StatefullRoom extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode:"open"})
    }

    connectedCallback() {
        console.log("connected")
        render(template(), this.shadowRoot)
    }    
}

customElements.define("state-full-room", StatefullRoom);
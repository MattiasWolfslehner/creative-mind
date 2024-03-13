//brainwriting ts import => see brainwriting.ts
import { html, render } from "lit-html"
import "./brainwriting/brainwriting"
import "./create-room/create-room"


function template() {
    return html`
            <create-room></create-room>
        `
}

class AppComponent extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode:"open"})
    }

    connectedCallback() {
        render(template(), this.shadowRoot)
       
    }
}

customElements.define("app-component", AppComponent)
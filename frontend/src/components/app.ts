//brainwriting ts import => see brainwriting.ts
import { html, render } from "lit-html"
import "./brainwriting/brainwriting"


function template() {
    return html`
            <brain-writing></brain-writing>  
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
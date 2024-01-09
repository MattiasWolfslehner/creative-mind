import { html, render } from "../../../node_modules/lit-html/lit-html"

const template = (greeting: string)=> html`
<div>
    ${greeting}
</div>
`

//attribute change callback
// html custom events for save
// mit lit

class BrainwritingElement extends HTMLElement {
    greeting: string

    connectedCallback() {
        console.log("connected")
        this.greeting = "Hello World again!"
        render(template(this.greeting), this)
    }

    //auch als function ausserhalb der class möglich
}


customElements.define("brain-writing", BrainwritingElement)
//brainwriting ts import => see brainwriting.ts
import { html, render } from "lit-html"
import "./brainwriting/brainwriting"
import "./panel/panel"
import {router} from "../../router"


const template = ()=> html`
            <panel-component></panel-component>
`;

class AppComponent extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode:"open"})
    }

    connectedCallback() {
        //http://localhost:9000/#/room/5
        router.on('/room/:roomId', ({data}) => {
            //get Room data (ideas,members,etc.) from backend and set create-room hidden.!
            console.log(`route: `, data);
        });

        render(template(), this.shadowRoot)
    }
}

customElements.define("app-component", AppComponent)
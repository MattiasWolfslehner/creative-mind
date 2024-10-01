//brainwriting ts import => see brainwriting.ts
import { html, render } from "lit-html"
import "./brainwriting/brainwriting"
import "./panel/panel"
import keycloakService from '../service/keycloak';
import {store} from "../model";


const template = ()=> html`
            <panel-component></panel-component>
`;

class AppComponent extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode:"open"})
    }

    connectedCallback() {

        document.addEventListener('click', (event) => {
            const v = event.composedPath();
            if (v) {
                if (v[0]) {
                    if (v[0]["id"] === "logoutButton") {
                        const model = store.getValue();
                        if (model.thisUserId) {
                            keycloakService.logout();
                        } else {
                            keycloakService.login().then(()=>{console.log("logged in!")});
                        }
                    }
                }
            }
        });

        render(template(), this.shadowRoot)
    }
}

customElements.define("app-component", AppComponent)
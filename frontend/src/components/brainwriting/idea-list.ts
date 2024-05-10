import { html, render, nothing } from "lit-html"
import { store } from "../../model/store"
import { Model } from "src/model"
import roomService from "../../service/room-service";


class IdeaList extends HTMLElement {


    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    template(model: Model, roomId) {
        const ideaTemplates = model.ideas.map(idea =>
                    html`${(idea.roomId===roomId)?html`
                        <li>
                            ${idea.memberId}: ${idea.content} 
                        </li>
                    `:nothing}`);
        return html`
                <h1>List of Ideas so far</h1>
            <table>
                <ul>
                    ${ideaTemplates}
                </ul>
            </table>
            `;
    }

    connectedCallback() {
        store.subscribe(model => {
            //console.log(model);
            render(this.template(model, ""), this.shadowRoot)
        })
    }

}

customElements.define("idea-list", IdeaList)
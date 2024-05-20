import {html, Part, render} from "lit-html"
import { store } from "../../model/store"
import { Model } from "src/model"
import {distinctUntilChanged, map} from "rxjs";
import {Participation} from "../../model/participation";


class ParticipantList extends HTMLElement {

    template(participations:Participation[]) {
        const userTemplates = participations.map(participation => html`
    <li>
        ${participation.member.userName} 
    </li> 

    `)
        return html`
            <h1>Participants</h1>
        <table>
            <ul>
                ${userTemplates}
            </ul>
        </table>
        `;
    }

    constructor() {
        super();

        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        store.pipe(map( model => model.participations ),distinctUntilChanged())
            .subscribe(participations => {
                render(this.template(participations), this.shadowRoot);
            });
    }

}

customElements.define("participant-list", ParticipantList)
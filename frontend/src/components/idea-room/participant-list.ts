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
        <style>
            :host {
                display: block;
                font-family: sans-serif;
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                max-width: 300px;
                margin: auto;
            }
            
            h1 {
                font-size: 1.5em;
                color: #333;
                text-align: center;
                margin-bottom: 20px;
            }

            ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            li {
                background-color: #fff;
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 10px;
                margin-bottom: 10px;
                font-size: 1em;
                color: #555;
                text-align: center;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                transition: background-color 0.3s ease, color 0.3s ease;
            }

            li:hover {
                background-color: #8D63D0;
                color: #fff;
            }
        </style>

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
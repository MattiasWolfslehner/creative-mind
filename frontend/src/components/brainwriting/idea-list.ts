import { html, render, nothing } from "lit-html"
import { store } from "../../model/store"
import { Model } from "src/model"
import roomService from "../../service/room-service";
import ideaService from "../../service/idea-service";


class IdeaList extends HTMLElement {


    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    template(model: Model, roomId) {
        const ideaTemplates = model.ideas.map(idea =>
                    html`${(idea.roomId===roomId)?
                        html`
                        <tr>
                            <td>${idea.memberId}</td>
                            <td>${idea.content}</td>
                        </tr>
                    `:nothing
        }`);
        return html`
            <!-- let's do some styling -->
            <style> 
                .styled-table {
                    border-collapse: collapse;
                    margin: 25px 0;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
                }

                .styled-table td {
                    padding: 10px;
                }

                .styled-table thead td {
                    background-color: #54585d;
                    color: #ffffff;
                    font-weight: bold;
                    font-size: 13px;
                    border: 1px solid #dddfe1;
                }

                .styled-table tbody td {
                    border: 1px solid #dddfe1;
                }
            </style>
                <h1>List of Ideas so far</h1>
                <div @click= "${() => this.onRefresh()}"
                    style="background-color: white; width: 20vw; height: auto; text-align: center;
                    font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px; cursor:pointer">
                <h2>Refresh</h2>
                </div>
            <table class="styled-table">
                <thead>
                <tr>
                    <td>User</td>
                    <td>Message</td>
                </tr>
                </thead>
                <tbody>
                    ${ideaTemplates}
                </tbody>
            </table>
            `;
    }

    connectedCallback() {
        store.subscribe(model => {
            //console.log(model);
            render(this.template(model, model.activeRoomId), this.shadowRoot)
        });
    }

    onRefresh () {
        const model = store.getValue();
        const ideas = ideaService.getIdeasByRoomId(model.activeRoomId);
    }

}

customElements.define("idea-list", IdeaList)
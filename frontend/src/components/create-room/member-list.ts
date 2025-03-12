import { html, render } from "lit-html";
import { store } from "../../model/store";
import { Model, User } from "src/model";
import { distinctUntilChanged, map } from "rxjs";

class MemberList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    template(users) {
        const userTemplates = users.map(
            (user) => html`
            <div class="member-card">
                <p><strong>ID:</strong> ${user.userId}</p>
                <p><strong>Name:</strong> ${user.userName}</p>
            </div>
        `);

        return html`
        <style>
        h1 {
            font-size: 2em;
            color: #333;
            text-align: center;
            margin-bottom: 2vw;
        }

        .member-list-container {
            margin-top: 3vw;
            display: flex;
            flex-wrap: wrap;
            gap: 2vw;
            justify-content: center;
        }

        .member-card {
            position: relative;
            background-color: #7eede5;
            width: 30vw;
            max-width: 300px;
            padding: 2vw;
            box-shadow: 0 0.5vw 1vw rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
            transform: rotate(-1deg);
        }

        .member-card:nth-child(3n + 1) {
            background-color: #f06568;
        }

        .member-card:nth-child(3n + 2) {
            background-color: #ffe76a;
        }

        .member-card::before {
            content: "";
            position: absolute;
            top: -1vw;
            left: 50%;
            transform: translateX(-50%);
            width: 1.5vw;
            height: 1.5vw;
            background-color: black;
            border-radius: 50%;
            box-shadow: 0 0.2vw 0.5vw rgba(0, 0, 0, 0.3);
        }

        .member-card p {
            margin: 0.5em 0;
            color: #333;
        }

        #backButton {
            background-color: #fff;
            font-size: 1.2em;
            padding: 1em 2em;
            margin: 2vw auto;
            text-align: center;
            cursor: pointer;
            border: none;
            border-radius: 0.5vw;
            width: fit-content;
            display: block;
        }

        #backButton:hover {
            background-color: #eee;
        }

        @media (max-width: 768px) {
            .member-card {
                width: 80vw;
                transform: rotate(0deg);
            }

            h1 {
                font-size: 1.5em;
            }
        }
        </style>

        <h1 style="margin-top: 6vw; margin-bottom: -0.5vw; color: white; font-family: 'sans-serif';">
            Member List
        </h1>
        <hr style="border: 2px solid #8D63D0; width: 65vw;" />
        <div class="member-list-container">${userTemplates}</div>
        <button id="backButton">Collapse Member List</button>
        `;
    }

    connectedCallback() {
        store.pipe(
            map((model) => model.users),
            distinctUntilChanged()
        ).subscribe(users => {
            render(this.template(users), this.shadowRoot);
            this.addClickEventListeners();
        });
    }

    addClickEventListeners() {
        const backButton = this.shadowRoot.getElementById("backButton");
        if (backButton) {
            backButton.addEventListener("click", () => {
                this.style.display = "none"; // Versteckt die Komponente
            });
        }
    }
}

customElements.define("member-list", MemberList);
export default MemberList;

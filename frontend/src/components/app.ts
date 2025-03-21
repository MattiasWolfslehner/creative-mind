//brainwriting ts import => see brainwriting.ts
import { html, render } from "lit-html"
import "./brainwriting/brainwriting"
import "./panel/panel"
import keycloakService from '../service/keycloak';
import {store} from "../model";
import {distinctUntilChanged, map} from "rxjs";


class AppComponent extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode:"open"})
    }

    template (activeUserId) {
        return (html`
    <style>
        #profileImage, .logout-image {
            position: absolute;
            top: 2vw;
            right: 2vw;
            background-color: white;
            width: 6vw;
            height: auto;
            cursor: pointer;
        }
        
        .dropdown {
            position: absolute;
            top: 9vw;
            right: 2vw;
            width: 8vw;
            height: 60px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            display: none;
            z-index: 10;
        }

        .arrow-up {
            position: absolute;
            top: -1.5vh;
            right: 2vw;
            width: 0;
            height: 0;
            border-left: 15px solid transparent;
            border-right: 15px solid transparent;
            border-bottom: 15px solid white;
        }

        .dropdown::after {
            content: "";
            position: absolute;
            top: 0vh;
            right: 10%;
            transform: translateX(-50%);
            border-width: 10px;
            border-style: solid;
            border-color: transparent transparent white transparent;
        }

        .dropdown-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 100%;
            padding: 10px;
            box-sizing: border-box;
        }

        .logout-button {
            background-color: #8D63D0;
            color: white;
            border: none;
            width: 8vw;
            border-radius: 5px;
            padding: 10px 20px;
            cursor: pointer;
            font-family: 'sans-serif';
            font-size: 1em;
        }

        .logout-image {
            width: 2vw;
            height: auto;
        }
        
        footer {
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 2rem;
            text-align: center;
            font-family: Arial, sans-serif;
            margin-top: 2rem;
            display: flex;
            justify-content: space-around;
        }

        .footer-logo {
            width: 100px;
            height: auto;
            margin-bottom: 1rem;
        }

        .footer-links {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 1rem;
        }

        .footer-links a {
            color: #63b3ed;
            text-decoration: none;
            font-size: 0.9rem;
        }

        .footer-links a:hover {
            text-decoration: underline;
        }

        .footer-text {
            font-size: 0.8rem;
            opacity: 0.8;
        }

        #contactBox {
            display: block;
            align-items: left;
        }
    </style>
    
    <img id="profileImage" alt="Profile (to login/logout)" src="https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png" style="border-radius: 50%">
    
    <div class="dropdown" id="dropdownMenu">
        <div class="arrow-up"></div>
        <div class="dropdown-content">
            <button class="logout-button" id="logoutButton">${(activeUserId)?"Logout":"Login"}</button>
            <!--<img alt="logout image only" src="https://static-00.iconduck.com/assets.00/logout-icon-2048x2048-libuexip.png" class="logout-image">-->
        </div>
    </div>
    
    <panel-component></panel-component>

    <footer>
        <div>
            <img src="https://i.ibb.co/Fh3qZHS/Creative-Minds-Logo-Dark.webp" alt="Creative Minds Logo" class="footer-logo">
            <div class="footer-links">
                <a href="#">File an Issue</a>
                <a href="#">Get Help</a>
                <a href="#">Discuss Source Code</a>
            </div>
            <div class="footer-text">
                &copy; 2024-2025 Creative Minds. All rights reserved.
            </div>
        </div>
        <div id="contactBox">
            <h1>Contact Us</h1>
            <p>4060 Leonding</p>
            <p>Limesstraße 12-14</p>
        </div>
    </footer>
`);
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
                    if (v[0]["id"] === "profileImage" || v[0]["id"] === "dropdownMenu") {
                        let dropdownMenu = this.shadowRoot.getElementById('dropdownMenu');
                        if (dropdownMenu.style.display === 'block') {
                            dropdownMenu.style.display = 'none';
                        } else {
                            dropdownMenu.style.display = 'block';
                        }
                    }
                }
            }
        });

        store.pipe(map( model => model.thisUserId ), distinctUntilChanged())
            .subscribe(thisUserId => {
                render(this.template(thisUserId), this.shadowRoot)
            });
    }
}

customElements.define("app-component", AppComponent)

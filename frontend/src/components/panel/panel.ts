import { html, render } from "lit-html";
import "../create-room/create-room"
import "../create-room/room-list"
import "../room/statefullroom"
import "./room-manager-socket-service"
import { store } from "../../model"
import { distinctUntilChanged, map } from "rxjs";
import {router} from "../../../router";


const template = (isInRoom : boolean, isRoomList : boolean)=> html`
    <style>
        h1 {
            margin-top: 3vh;
            margin-left: 3vw;
            color: white;
            font-family: 'sans-serif';
            cursor: pointer;
        } 
    </style>

    <!--<h1 id="homeButtonId" @click="${() => {router.navigate("/");}}">Creative Minds</h1>-->
    <div>
        <create-room ?hidden = ${(isInRoom || isRoomList)} ></create-room>
        <room-list ?hidden = ${(isInRoom || !isRoomList)} ></room-list>
        <state-full-room ?hidden = ${!isInRoom} ></state-full-room>
        <room-manager-socket-service></room-manager-socket-service>
    </div>
`;

class PanelComponent extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode:"open"});
    }

    connectedCallback() {
        store.pipe(
            map( model => ({
                activeRoomId: model.activeRoomId,
                isRoomList: model.isRoomList
            })),distinctUntilChanged())
        .subscribe(reduced_model => {
            render(template(((reduced_model.activeRoomId)?reduced_model.activeRoomId.length!=0:false), reduced_model.isRoomList), this.shadowRoot)
        });
    }
}

customElements.define("panel-component", PanelComponent);
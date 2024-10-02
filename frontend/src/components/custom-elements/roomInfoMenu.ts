import { html, render } from "lit-html"
import { distinctUntilChanged, map } from "rxjs";
import { store } from "../../model/store"
import { Room } from "src/model";
import { Participation } from "src/model/participation";

class RoomInfoMenu extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }


    template(participations: Participation[], room: Room) {
        
        return html`
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background: #fff !important;
                }
                a {
                    color: #fff;
                    text-decoration: none;
                }
                #roomInfo {
                    position: absolute;
                    top: 1vw;
                    left: 2vw;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 30vw;
                    height: 65px;
                    border-radius: 5px;
                    background-color: #8D63D0;
                    padding: 0 10px;
                    font-family: 'sans-serif';
                    color: white;
                }
                #roomInfo div {
                    padding: 0 1rem;
                }
                #roomMenu {
                    position: absolute;
                    top: 1vw;
                    left: 35vw;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 15vw;
                    height: 65px;
                    border-radius: 5px;
                    background-color: #8D63D0;
                    padding: 0 10px;
                    box-sizing: border-box;
                    font-family: 'sans-serif';
                }        
                .menu-item {
                    display: flex;
                    align-items: center;
                }        
                .burger-menu {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    width: 40px;
                    height: 24px;
                    cursor: pointer;
                }
                .burger-menu div {
                    width: 100%;
                    height: 6px;
                    background-color: #fff;
                    border-radius: 2px;
                    margin: 5%;
                }
                .member-count {
                    width: 49px;
                    height: 49px;
                    border-radius: 50%;
                    background-color: #fff;
                    border: 3px solid #7A49C9;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.5em;
                }
                .share-box {
                    display: flex;
                    align-items: center;
                    width: 141px;
                    height: 48px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    padding: 0 10px;
                    box-sizing: border-box;
                    cursor:pointer;
                }        
                .share-box img {
                    width: 48px;
                    height: 48px;
                    border-radius: 5px;
                }        
                .share-box span {
                    margin-left: 10px;
                    font-size: 1.5em;
                    color: #000;
                }
                .tooltip {
                    visibility: hidden;
                    width: 133px;
                    background-color: #555;
                    color: #fff;
                    text-align: center;
                    border-radius: 5px;
                    padding: 5px;
                    position: absolute;
                    z-index: 1;
                    top: 120%;
                    left: 10.8vw;
                    transform: translateX(-50%);
                    opacity: 0;
                    transition: opacity 0.3s;
                    margin-top: 5px;
                }        
                .share-box:hover .tooltip {
                    visibility: visible;
                    opacity: 1;
                }        
                .tooltip::after {
                    content: "";
                    position: absolute;
                    top: -18%;
                    left: 4vw;
                    transform: translateX(-50%);
                    border-width: 5px;
                    border-style: solid;
                    border-color: transparent transparent #555 transparent;
                }
            </style>
            
            <div id="roomInfo">
                <div>
                    <a href="#"><h1>Creative Minds</h1></a>
                </div>
                <div>
                    <h2>|<h2>
                </div>
                <div>
                    <h2 id="roomName">${room?(room.name?room.name:"NONAME2"):"NONAME"}</h2>
                </div>
            </div>  
            <div id="roomMenu">
                <div class="menu-item burger-menu">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div class="menu-item member-count">
                    ${(participations)?(participations.length):0}
                </div>
                <div class="menu-item share-box" @click="${() => this.shareRoom()}">
                    <img src="https://png.pngtree.com/png-vector/20191004/ourmid/pngtree-person-icon-png-image_1788612.jpg" alt="Person Icon">
                    <span>Share</span>
                    <div class="tooltip">Copy link to clipboard</div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        store.pipe(map(model => ({
            ideas: model.ideas,
            rooms: model.rooms,
            participations: model.participations,
            activeRoomId: model.activeRoomId,
            thisUserId: model.thisUserId
        })),distinctUntilChanged())
            .subscribe(reduced_model => {
            const thisRooms = reduced_model.rooms.filter(
                (room) => room.roomId === reduced_model.activeRoomId
            );
            let thisRoom: Room = null;
            thisRoom = thisRooms[0];

            render(this.template(reduced_model.participations, thisRoom), this.shadowRoot);
        });
    }

    shareRoom() {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            alert('Link copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });        
    }
}

customElements.define("room-info-menu", RoomInfoMenu);
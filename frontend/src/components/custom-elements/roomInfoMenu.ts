import { html, render } from "lit-html";
import { distinctUntilChanged, map } from "rxjs";
import { store } from "../../model/store";
import { Room } from "src/model";
import { Participation } from "src/model/participation";
import { toDataURL } from "qrcode";

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
                    top: 2vw;
                    left: 2vw;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 30vw;
                    height: 6vw;
                    border-radius: 0.5vw;
                    background-color: #8D63D0;
                    padding: 0 1vw;
                    font-family: sans-serif;
                    color: white;
                    font-size: 1.1vw;
                }
                #roomInfo div {
                    padding: 0 1vw;
                }
                #roomMenu {
                    position: absolute;
                    top: 2vw;
                    left: 35vw;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 30vw;
                    height: 6vw;
                    border-radius: 0.5vw;
                    background-color: #8D63D0;
                    padding: 0 1vw;
                    box-sizing: border-box;
                    font-family: sans-serif;
                    font-size: 1vw;
                }
                .menu-item {
                    display: flex;
                    align-items: center;
                }
                .burger-menu {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    width: 4vw;
                    height: 2vw;
                    cursor: pointer;
                }
                .burger-menu div {
                    width: 100%;
                    height: 0.5vw;
                    background-color: #fff;
                    border-radius: 0.2vw;
                    margin: 2%;
                }
                .member-count {
                    width: 4vw;
                    height: 4vw;
                    border-radius: 50%;
                    background-color: #fff;
                    border: 0.3vw solid #7A49C9;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.2vw;
                }
                .share-box {
                    display: flex;
                    align-items: center;
                    width: 15vw;
                    height: 5vw;
                    background-color: #fff;
                    border-radius: 0.5vw;
                    box-shadow: 0 0.2vw 0.4vw rgba(0, 0, 0, 0.1);
                    padding: 0 1vw;
                    box-sizing: border-box;
                    cursor: pointer;
                    position: relative;
                }
                .share-box img {
                    width: 4vw;
                    height: 4vw;
                    border-radius: 0.5vw;
                }
                .share-box span {
                    margin-left: 1vw;
                    font-size: 1.5vw;
                    color: #000;
                }
                .tooltip {
                    visibility: hidden;
                    width: 13vw;
                    background-color: #555;
                    color: #fff;
                    text-align: center;
                    border-radius: 0.5vw;
                    padding: 0.5vw;
                    position: absolute;
                    z-index: 1;
                    top: 110%;
                    left: 50%;
                    transform: translateX(-50%);
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                .share-box:hover .tooltip {
                    visibility: visible;
                    opacity: 1;
                }
                .tooltip::after {
                    content: "";
                    position: absolute;
                    top: -0.7vw;
                    left: 50%;
                    transform: translateX(-50%);
                    border-width: 0.5vw;
                    border-style: solid;
                    border-color: transparent transparent #555 transparent;
                }
                #qr-canvas {
                    display: flex;
                    justify-content: center;
                    margin-top: 0; /* takes up too much space */
                }
                #qrCodeImage {
                    max-width: 100%;
                    height: auto;
                }
            </style>
            
            <div id="roomInfo">
                <div>
                    <a href="#"><h1>Creative Minds</h1></a>
                </div>
                <div>
                    <h2>|</h2>
                </div>
                <div>
                    <h2 id="roomName">${room?.name ?? "NONAME"}</h2>
                </div>
            </div>
            <div id="roomMenu">
                <div class="menu-item burger-menu">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div class="menu-item member-count">
                    ${participations?.length ?? 0}
                </div>
                <div class="menu-item share-box" @click="${() => this.shareRoom()}">
                    <img src="https://png.pngtree.com/png-vector/20191004/ourmid/pngtree-person-icon-png-image_1788612.jpg" alt="Person Icon">
                    <span>Share</span>
                    <div class="tooltip">Copy link to clipboard</div>
                </div>
            </div>
            <div id="qr-canvas">
                <img src="" id="qrCodeImage">
            </div>
        `;
    }

    connectedCallback() {
        store.pipe(
            map(model => ({
                participations: model.participations,
                rooms: model.rooms,
                activeRoomId: model.activeRoomId,
            })),
            distinctUntilChanged()
        ).subscribe(reducedModel => {
            const thisRoom = reducedModel.rooms.find(room => room.roomId === reducedModel.activeRoomId) || null;
            render(this.template(reducedModel.participations, thisRoom), this.shadowRoot!);
        });
    }

    async shareRoom() {
        const currentUrl: string = window.location.href;
    
        try {
            await navigator.clipboard.writeText(currentUrl);
            alert("Link copied to clipboard!");
    
            toDataURL(currentUrl, (err, dataUrl) => {
                if (!err) {
                    const newWindow = window.open("", "_blank", "width=300,height=300");
                    if (newWindow) {
                        newWindow.document.write(`
                            <html>
                                <head>
                                    <title>QR Code</title>
                                </head>
                                <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0;">
                                    <img src="${dataUrl}" alt="QR Code">
                                </body>
                            </html>
                        `);
                        newWindow.document.close();
                    }
                }
            });
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    }    
}

customElements.define("room-info-menu", RoomInfoMenu);

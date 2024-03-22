import { html, render } from "lit-html"

const template = ()=> html`

`

class CreateRoomButtonElement extends HTMLElement {
    template(){
        return html`
        <div style="margin-top: 30vh; display: flex; flex-wrap: wrap; justify-content: space-around; cursor:pointer">
            <div id="createRoomButton" @click= ${() => this.createRoom()}
            style="background-color: white; width: 20vw; height: auto; text-align: center; font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px">
                <h2 style="user-select: none">Create Room</h2>
            </div>
        </div>
        `
    }

    constructor() {
        super()
        this.attachShadow({mode:"open"})
    }

    connectedCallback() {
        console.log("connected")
        render(this.template(), this.shadowRoot)
    }
    
    createRoom(){
        console.log("create room pressed!");
        
    }

}


customElements.define("create-room-button", CreateRoomButtonElement)
/*import { html, render } from "lit-html"
import roomService from "../../service/room-service"
import { Room, store } from "../../model"
import { router } from "../../../router"
import { produce } from "immer"


class CreateRoomButtonElement extends HTMLElement {
    template(){
        return html`
        <div style="margin-top: 30vh; display: flex; flex-wrap: wrap; justify-content: space-around; cursor:pointer">
            <div id="createRoomButton" @click= ${() => this.createRoom('brainwritingroom')}
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
    
    createRoom(roomType){
        console.log("create room pressed!");

        // Todo: store type variable in the local storage to read it 
        const roomId = roomService.createRoom(roomType).then(value => {
            router.navigate(`/room/` + value.roomId);
          });  
        
        const model = produce(store.getValue(), draft => {
            draft.isInRoom = true;
        })
        store.next(model);
    }

}


customElements.define("create-room-button", CreateRoomButtonElement)*/
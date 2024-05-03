import { html, render } from "lit-html";
import {router} from "../../../router";
import { store } from "../../model";

const template = (roomType:string, roomId:string)=> html `
<h1>here comes the right view for the room type</h1>
<p>${roomType} :${roomId}</p>

`

class StatefullRoom extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode:"open"})
    }

    connectedCallback() {
        console.log("connected");
        
        var roomId = null;

        //http://localhost:9000/#/room/5
        router.on('/room/:roomId', ({data}) => {
            console.log(`route: `, data.roomId);
            roomId = data.roomId;
            var roomType = '';

            // get Room from store
            store.subscribe(model => {
                console.log('model:',model);
                const room = model.rooms.find(r => r.roomId === roomId);
                if (room) {
                    roomType = room.type;
                } else {
                    roomType = 'brainwritingroom';
                }
                console.log('roomType: ', roomType);

                render(template(roomType,roomId), this.shadowRoot);

            })
        
        });

    }    
}

customElements.define("state-full-room", StatefullRoom);
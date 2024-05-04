import { html, render, nothing } from "lit-html";
import {router} from "../../../router";
import { store } from "../../model";



const template = (roomType:string, roomId:string)=> html `
<h1>here comes the right view for the room type</h1>
<p>${roomType} :${roomId}</p>
<p>
</p>
${(roomType === "brainwritingroom") ? html `
    BW
    <brainwriting-element roomId="${roomId}"></brainwriting-element>
` : nothing }
${(roomType === "brainstormingroom") ? html `
    BS
    <brainstorming-element roomId="${roomId}"></brainstorming-element>
` : nothing }
`
class StatefullRoom extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode:"open"})

    }

    roomId : string = "";

    connectedCallback() {
        console.log("connected");
        
        //var roomId = null;

        //http://localhost:9000/#/room/5
        router.on('/room/:roomId', ({data}) => {
            console.log(`route: `, data.roomId);
            this.roomId = data.roomId;
            var roomType = '';

            // get Room from store
            store.subscribe(model => {
                console.log('model:',model);
                const room = model.rooms.find(r => r.roomId === this.roomId);
                if (room) {
                    roomType = room.type;
                } else {
                    roomType = 'brainwritingroom';
                }
                console.log(`sfr roomType: ${roomType} ddd`);

                render(template(roomType,this.roomId), this.shadowRoot);

            })
        
        });

    }    
}

customElements.define("state-full-room", StatefullRoom);
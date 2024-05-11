import { html, render, TemplateResult } from "lit-html";
import roomService from "../../service/room-service";
import { Room, store } from "../../model";
import { router } from "../../../router";
import { produce } from "immer";
import "../../style/create-room/creativity-technique-style.css";

const template: () => TemplateResult = () => html`
    <style>
    .active {
    background-color: #8D63D0;
    color: white;
    }

    .inactive {
    background-color: rgba(141, 99, 208, 0.4);
    color: rgba(255, 255, 255, 0.4);
    }

    #creativityTechniques {
    margin-top: 3vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    }

    .technique-container {
    width: 20vw;
    height: auto;
    text-align: center;
    font-family: 'sans-serif';
    margin-bottom: 20px;
    border-radius: 10px;
    cursor: pointer;
    }
    </style>

    <div id="creativityTechniques">
        <div id="brainwritingroom" class="technique-container inactive">
            <h2>6-3-5</h2>
        </div>
        <div id="mindmaproom" class="technique-container inactive">
            <h2>MindMap</h2>
        </div>
        <div id="zwickyboxroom" class="technique-container inactive">
            <h2>Zwicky-Box</h2>
        </div>
        <div id="brainstormingroom" class="technique-container active">
            <h2>Brainstorm</h2>
        </div>
    </div>

    <div style="margin-top: 30vh; display: flex; flex-wrap: wrap; justify-content: space-around; cursor:pointer">
        <div id="createRoomButton"
             style="background-color: white; width: 20vw; height: auto; text-align: center; font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px">
            <h2 style="user-select: none">Create Room</h2>
        </div>
        <div id="showRoomListButton"
             style="background-color: white; width: 20vw; height: auto; text-align: center; font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px">
            <h2 style="user-select: none">Show Available Rooms</h2>
        </div>
    </div>
`;

class CreateRoomElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        //console.log("connected");
        render(template(), this.shadowRoot);
        this.addClickEventListeners();
    }
    
    private addClickEventListeners(): void {
        const techniqueContainers = this.shadowRoot.querySelectorAll('.technique-container');
        techniqueContainers.forEach(container => {
            container.addEventListener('click', () => {
                techniqueContainers.forEach(tc => {
                    tc.classList.remove('active', 'inactive');
                });
    
                container.classList.add('active');
    
                techniqueContainers.forEach(tc => {
                    if (tc !== container) {
                        tc.classList.add('inactive');
                    }
                });
            });
        });
        const createRoomButton = this.shadowRoot.getElementById('createRoomButton');
        createRoomButton.addEventListener('click', () => {
            const activeTechniqueContainer = this.shadowRoot.querySelector('.technique-container.active');
            if (activeTechniqueContainer) {
                this.createRoom(activeTechniqueContainer.id); // do not assign to room id, gives void
            }
        });
        const showRoomListButton = this.shadowRoot.getElementById('showRoomListButton');
        showRoomListButton.addEventListener('click', () => {
            // read (possibly changed) roomstates
            const x = roomService.getRooms();
            // then change application state
            const model = produce(store.getValue(), draft => {
                draft.isRoomList = true;
                draft.activeRoomId = "";
            });
            store.next(model);
        });
    }
    
    createRoom(roomType: string): void {
        console.log(`Creating room with room type: ${roomType}<`);
        // create the room and navigate into it
        const roomId: Promise<void | Room> = roomService.createRoom(roomType).then(value => {
            const model = produce(store.getValue(), draft => {
                draft.rooms.push(value);
                draft.activeRoomId = value.roomId;
                draft.isRoomList = false;
            });
            store.next(model);

            router.navigate(`/room/${value.roomId}`);
        });
    }
    
}

customElements.define("creativity-technique", CreateRoomElement);
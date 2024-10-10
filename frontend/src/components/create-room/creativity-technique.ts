import { html, render, TemplateResult } from "lit-html";
import roomService from "../../service/room-service";
import { Room, store } from "../../model";
import { router } from "../../../router";
import { produce } from "immer";
import "../../style/create-room/creativity-technique-style.css";
import {distinctUntilChanged, map} from "rxjs";



class CreateRoomElement extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    template (activeUserId: string) {
        return (html`
    <style>
    .active {
    background-color: #8D63D0;
    color: white;
    }

    .inactive {
    background-color: rgba(141, 99, 208, 0.4);
    color: rgba(255, 255, 255, 0.4);
    }
    
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin-top: 10vh;
    }
    .styled-input {
        width: 100%;
        max-width: 1070px;
        height: 60px;
        background-color: #8D63D0;
        color: #fff;
        border: 5px solid #9D75EF;
        box-sizing: border-box;
        font-size: 16px;
        padding: 0 10px;
        outline: none;
        margin-bottom: 20px;
        border-radius: 5px;
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
        <!--<div id="brainwritingroom" class="technique-container inactive">
            <h2>6-3-5</h2>
        </div>
        <div id="mindmaproom" class="technique-container inactive">
            <h2>MindMap</h2>
        </div>-->
        <div id="morphologicalroom" class="technique-container inactive">
            <h2>Morphological Box</h2>
        </div>
        <!--<div id="brainstormingroom" class="technique-container active">
            <h2>Brainstorming</h2>
        </div>-->
    </div>

    <div class="container" style="display: flex; flex-wrap: wrap; justify-content: space-around">
        <input id="room-name" type="text" class="styled-input" name="" placeholder="give your room a name">
    </div>
    
    <div style="margin-top: 15vh; display: flex; flex-wrap: wrap; justify-content: space-around">
        <div id="createRoomButton" .disabled="${((activeUserId)?"true":"false")}"
             style="background-color: white; width: 20vw; height: auto; text-align: center; font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px">
            <h2 style="user-select: none">Create Room</h2>
        </div>
        <div id="showRoomListButton" .disabled="${((activeUserId)?"true":"false")}"
             style="background-color: white; width: 20vw; height: auto; text-align: center; font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px">
            <h2 style="user-select: none">Show My Rooms</h2>
        </div>
    </div>
`);
    }

    connectedCallback() {
        //console.log("connected");

        // add change ...
        store.pipe(map( model => model.thisUserId ), distinctUntilChanged())
            .subscribe(thisUserId => {
                render(this.template(thisUserId), this.shadowRoot)
            });

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
            const model = store.getValue();
            if (model.thisUserId) {
                const activeTechniqueContainer = this.shadowRoot.querySelector('.technique-container.active');
                if (activeTechniqueContainer) {
                    const roomName: string = this.shadowRoot.querySelector("input").value;
                    // simply create the room for the selected type over container id
                    this.createRoom(activeTechniqueContainer.id, roomName); // do not assign to room id, gives void
                }
            } else {
                alert("Please Login first"); // trivial message
            }
        });

        const showRoomListButton = this.shadowRoot.getElementById('showRoomListButton');
        showRoomListButton.addEventListener('click', () => {
            const model = store.getValue();
            if (model.thisUserId) {
                // change view type to room list (join other rooms rather than create it)
                // read (possibly changed) roomstates
                const x = roomService.getRooms();
                // then change application state
                const model = produce(store.getValue(), draft => {
                    draft.isRoomList = true;
                    draft.activeRoomId = "";
                });
                store.next(model);
            } else {
                alert("Please Login first"); // trivial message
            }
        });
    }
    
    createRoom(roomType: string, roomName: string): void {
        console.log(`Creating room with room type: ${roomType}`);
        // create the room and navigate into it
        const roomId: Promise<void | Room> = roomService.createRoom(roomType, roomName, null).then(value => {
            const model = produce(store.getValue(), draft => {
                //draft.rooms.push(value); push done in createRoom in Roomservice
                draft.activeRoomId = value.roomId;
                draft.isRoomList = false;
            });
            store.next(model);

            router.navigate(`/room/${value.roomId}`);
        });
    }
    
}

customElements.define("creativity-technique", CreateRoomElement);
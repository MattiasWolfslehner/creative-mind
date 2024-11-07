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
            margin-top: 3vh;
        }
        
        .styled-input {
            width: 80vw;
            max-width: 60vw;
            height: 6vh;
            background-color: #8D63D0;
            color: #fff;
            border: 0.3vw solid #9D75EF;
            box-sizing: border-box;
            font-size: 1.2vw;
            padding: 0 2vw;
            outline: none;
            border-radius: 1vw;
        }
        
        #creativityTechniques {
            margin-top: 3vh;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1.5vw;
            padding: 0 5vw;
        }
        
        .technique-container {
            width: 20vw;
            height: auto;
            text-align: center;
            font-family: 'sans-serif';
            margin-bottom: 2vh;
            padding: 1vh 1vw;
            border-radius: 1vw;
            cursor: pointer;
            font-size: 1.2vw;
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
    <div style="background-color: rgba(0, 0, 0, 0.5);padding:20px; border-radius: 10px; margin: 6vh">
        <h2 style="margin-bottom: -0.5vh; color: white; font-family: 'sans-serif'"> Der Morphologische Kasten (Zwicky Box)</h2>
        <p style="color: white; font-family: 'sans-serif'; font-size: 1.2rem">
        Der Morphologische Kasten ist eine Kreativitäts- und Problemlösungstechnik, 
        die von Fritz Zwicky entwickelt wurde. Sie dient dazu, komplexe Probleme systematisch zu analysieren und kreative Lösungen zu finden. Die Methode basiert darauf, 
        ein Problem in seine wesentlichen Parameter oder Dimensionen zu zerlegen und für jede Dimension mögliche Ausprägungen oder Optionen festzulegen. Diese Parameter und 
        ihre Ausprägungen werden in einer tabellenartigen Struktur, dem sogenannten Morphologischen Kasten, dargestellt.
        <br><br>
        Durch das systematische Kombinieren der verschiedenen Ausprägungen lassen sich viele verschiedene Lösungsmöglichkeiten erzeugen, 
        die man sonst vielleicht übersehen würde. Der Morphologische Kasten eignet sich besonders gut für Situationen, in denen es keine eindeutige Lösung gibt und kreative Ansätze gefragt sind, 
        wie z.B. in der Produktentwicklung, im Design oder bei der strategischen Planung.
        <br><br>
        Der Vorteil des Morphologischen Kastens liegt darin, 
        dass er durch die visuelle und strukturierte Darstellung hilft, den Lösungsraum umfassend zu erkunden. 
        Teams können gemeinsam Parameter festlegen und unterschiedliche Kombinationen bewerten, 
        was zu innovativen und vielfältigen Lösungsansätzen führt.
        </p>
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
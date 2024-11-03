import {html, nothing, render, TemplateResult} from "lit-html";
import {MBParameter, store} from "../../model";
import {distinctUntilChanged, map} from "rxjs";
import morphoService from "../../service/morpho-service";
import {MBRealization} from "../../model/mbrealization";
import {MBCombination} from "../../model/mbcombination";

class MorphologicalBox extends HTMLElement {
    isListenerAdded: boolean;
    parametersSaved: boolean;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.parametersSaved = false; // TODO: Must be true later on (when loading nothing changed)
    }

    async saveAllParameters() {
        const rows = this.shadowRoot.querySelectorAll('tbody tr');
        const roomId = store.getValue().activeRoomId;
        console.log(`room now ${roomId}`);
        for (let i = 0; i < rows.length; i++) {
            const parameterCell = rows[i].querySelector('td:first-child');
            const parameterTitle = parameterCell.textContent.trim();
    
            if (parameterTitle && !/Parameter|\+/.test(parameterTitle)) {
                try {
                    await morphoService.saveParameter(parameterTitle, roomId);
                    console.log(`Parameter "${parameterTitle}" erfolgreich gespeichert.`);
                } catch (error) {
                    console.error(`Fehler beim Speichern des Parameters "${parameterTitle}": ${error}`);
                }
            }
        }
    }    

    generateCombination() {
        const rows = this.shadowRoot.querySelectorAll('tbody tr');
        const combination = [];

        rows.forEach(row => {
            const selectedCell = row.querySelector('.selected-1, .selected-2, .selected-3');
            if (selectedCell && !/Realization \d+/.test(selectedCell.textContent)) {
                combination.push(selectedCell.textContent.trim());
            }
        });

        if (combination.length > 0) {
            //const combinations = this.shadowRoot.querySelector('.combinations');
            //combinations.innerHTML += `${combination.join(' | ')}<br>`;

            console.log(store.getValue().activeRoomId, store.getValue().thisUserId);

            morphoService.saveCombination(store.getValue().activeRoomId, store.getValue().thisUserId, combination.join(' | '));

        } else {
            console.log("No selection made.");
        }
    }

    addNewParameterRow(event) {
        console.log("addNewParameterRow");
        const clickedCell = event.target;
        if (clickedCell.textContent.trim() === "+") {
            const xxx = morphoService.saveParameter("new", store.getValue().activeRoomId);
        } else {
            console.log("wrong cell!");
        }
    }



    handleCellClick(event) {
        console.log("cell click");
        const clickedCell = event.target;
        const row = clickedCell.closest('tr');
        const cells = row.querySelectorAll('td');
        const rowIndex = Array.from(row.parentElement.children).indexOf(row);

        cells.forEach(cell => {
            cell.classList.remove("selected-1", "selected-2", "selected-3");
        });

        let selectedClass = "";
        if (rowIndex % 3 === 0) {
            selectedClass = "selected-1";
        } else if (rowIndex % 3 === 1) {
            selectedClass = "selected-2";
        } else if (rowIndex % 3 === 2) {
            selectedClass = "selected-3";
        }

        clickedCell.classList.add(selectedClass);
    }

    handleCellDblClick(event) {
        const clickedCell = event.target;
        const row = clickedCell.parentElement;
        const columnIndex = Array.from(row.children).indexOf(clickedCell);
        const rowIndex = Array.from(row.parentElement.children).indexOf(row);
    
        const previousText = clickedCell.textContent.trim();
    
        // Aktiviert den Bearbeitungsmodus, aber verhindert mehrfache Listener
        if (!clickedCell.isBeingEdited) {
            clickedCell.setAttribute('contenteditable', 'true');
            clickedCell.isBeingEdited = true;
            clickedCell.focus();
        }
    
        // Verwende "blur", um den Bearbeitungsmodus zu beenden
        const handleBlur = async () => {
            clickedCell.removeAttribute('contenteditable');
            clickedCell.isBeingEdited = false; // Entferne den Bearbeitungsstatus
    
            // Verwende setTimeout, um sicherzustellen, dass der Text vollständig aktualisiert wurde
            setTimeout(async () => {
                let newTitle = clickedCell.textContent.trim();
                let param_id = clickedCell.getAttribute("paramId");
                let content_id = clickedCell.getAttribute("content_id");

                const roomId = store.getValue().activeRoomId;
                if (columnIndex === 0 && newTitle !== previousText) {
                    try {
                        await morphoService.saveParameter(newTitle, roomId, param_id);
                        console.log(`Parameter "${newTitle}" erfolgreich gespeichert.`);
                    } catch (error) {
                        console.error(`Fehler beim Speichern des Parameters: ${error}`);
                    }
                } else if (columnIndex !== 0 && newTitle !== previousText) {
                    try {
                        if (content_id == -1) {
                            content_id = null;
                            clickedCell.textContent = ""; // must reset, cell ist placed somewhere else after refresh
                        }
                        await morphoService.saveRealization(param_id, newTitle, content_id);
                        console.log(`Realization "${newTitle}" erfolgreich gespeichert.`);
                    } catch (error) {
                        console.error(`Fehler beim Speichern der Realization: ${error}`);
                    }
                }
            }, 0); // Setzt den Timeout auf 0, um sicherzustellen, dass der DOM aktualisiert wird
        };
    
        // Sicherstellen, dass der "blur"-Listener nur einmal hinzugefügt wird
        if (!clickedCell.hasBlurListener) {
            clickedCell.addEventListener('blur', handleBlur, { once: true });
            clickedCell.hasBlurListener = true; // Setze ein Flag, um Mehrfachhinzufügungen zu verhindern
        }
    }    

    addClickListeners() {
        const parameters = this.shadowRoot.querySelectorAll('tbody tr:not(:last-child)')
        parameters.forEach(param => {
            if(param.getAttribute("has_my_listener_edit") !== "true") {
                param.setAttribute("has_my_listener_edit","true");
                param.addEventListener('dblclick', (event) => this.handleCellDblClick(event));
            }
        })
        const cells = this.shadowRoot.querySelectorAll('tbody tr:not(:last-child) td:not(:first-child):not(:last-child)');
        cells.forEach(cell => {
            if(cell.getAttribute("has_my_listener_click") !== "true") {
                cell.setAttribute("has_my_listener_click","true");
                cell.addEventListener('click', (event) => this.handleCellClick(event));
            }
            if(cell.getAttribute("has_my_listener_edit") !== "true") {
                cell.setAttribute("has_my_listener_edit","true");
                cell.addEventListener('dblclick', (event) => this.handleCellDblClick(event));
            }
        });
        const cells2 = this.shadowRoot.querySelectorAll('tbody tr:last-child td:first-child');
        cells2.forEach(cell => {
            if(cell.getAttribute("has_my_listener_add_P") !== "true") {
                cell.setAttribute("has_my_listener_add_P","true");
                console.log("add P Listener for", cell);
                cell.addEventListener('click', (event) => this.addNewParameterRow(event));
            }
        });
    }

    generateRealizations(p: MBParameter, realisations: number) {
        function compareRealizations(a:MBRealization, b:MBRealization) {
            if (a.contentId > b.contentId) {
                return(1);
            } else {
                return(-1); // equality should not exist
            }
        }
        if (p.realizations) {
            let rs = [...p.realizations];
            rs.sort(compareRealizations);
            let rrr = rs.map((r: MBRealization) =>
                html`
                    <td paramId="${p.paramId}" content_id="${r.contentId}">${r.content}</td>`
            );
            let i = p.realizations.length;
            for (; i < realisations + 1; i++) { // we need one more column for "ADD new realization"
                rrr.push(html`
                    <td paramId="${p.paramId}" content_id="-1"></td>`);
            }
            return rrr;
        }
        else {
            return html`
                    <td paramId="${p.paramId}" content_id="-1"></td>`;
        }
    }

    template(activeRoomId: string, parameters: MBParameter[], combinations: MBCombination[]) {
        if (!parameters) parameters = [];
        if (!combinations) combinations = [];
        //console.log(parameters);
        console.log(combinations);

        const component_header = html`
            <style>
                body {
                    background-color: #9D75EF;
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                
                .table-container {
                    margin-top: 10vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                table {
                    border-collapse: collapse;
                    border: 0.5vw solid #9D75EF;
                    background-color: #8d63d0;
                    border-radius: 0.3vw;
                }
                
                thead th, tbody td {
                    width: 10vw;
                    height: 7vh;
                    font-size: 1.5vw;
                    color: white;
                    border: 0.5vw solid #9D75EF;
                    text-align: center;
                    vertical-align: middle;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    padding: 0 0.5vw;
                    box-sizing: border-box;
                    cursor: pointer;
                }
                
                thead th {
                    font-size: 2vw;
                    font-weight: 600;
                }
                
                .selected-1 {
                    background-color: #F06568;
                }
                
                .selected-2 {
                    background-color: #FFE76A;
                }
                
                .selected-3 {
                    background-color: #7EEDE5;
                }
            
                .placeholder {
                    opacity: 0.6;
                }
            
                .folder-box {
                    width: 85vw;
                    height: 60vh;
                    background-color: #8d63d0;
                    border-radius: 0 1vw 1vw 1vw;
                    box-shadow: 0 0.5vw 1vw rgba(0, 0, 0, 0.1);
                    position: relative;
                    margin: 5vh auto;
                }
            
                .folder-tab {
                    position: absolute;
                    top: -4vh;
                    left: 0;
                    width: 17vw;
                    height: auto;
                    background-color: #8d63d0;
                    border-radius: 1vw 1vw 0 0;
                    text-align: center;
                    color: white;
                    font-size: 2.4vw;
                    font-weight: bold;
                    line-height: 6vh;
                }
            
                .folder-body {
                    padding: 2vw;
                    margin-top: 6vh;
                }
            
                .combinations {
                    color: #fff;
                    font-size: 1.6vw;
                }
            </style>
            
            <div class="table-container">
                    <table>
                        `;


        // const ideaTemplates = ideas.map((idea: Idea) =>
        //     this.checkShowIdeaInRoom(idea, room, userId)
        //         ? html`<div style="background-color: ${this.getRandomColor()};"><p>${idea.content}  \n <span style="font-size: smaller">(${this.getUserName(idea.memberId, participations)})</span></p></div>`
        //         : nothing
        // );

        let realizations = 0;
        parameters.forEach((p) => {
            if (p.realizations) {
                if (p.realizations.length > realizations) {
                    realizations = p.realizations.length;
                }
            }
        });
        console.log(`there are a max of ${realizations} realizations`);

        // create header row
        let rrr:TemplateResult<1>[] = [];
        let i = 0;
        for (;i<realizations;i++) {
            rrr.push(html`
                <th>Realization ${i+1}</th>`);
        }
        const table_header = html`
                        <thead>
                            <tr>
                                <th>Parameter</th>
                                ${rrr}
                                <th>+</th>
                            </tr>
                        </thead>
                        `;


        let sp = [...parameters];
        function compareParameter(a:MBParameter, b:MBParameter) {
            if (a.paramId > b.paramId) { // we can change that later to alphabetical
                return(1);
            } else {
                return(-1); // equality should not exist
            }
        }
        sp.sort(compareParameter);
        const parameterrows = sp.map((p: MBParameter) =>
           html`<tr>
               <td paramId="${p.paramId}">${p.title}</td>
               ${this.generateRealizations(p, realizations)}
                </tr>`
        );

        rrr = [];
        i = 0;
        for (;i<realizations;i++) {
            rrr.push(html`
                <td></td>`);
        }
        const table_body = html`
                        <tbody>
                            ${parameterrows}
                            <tr>
                                <td style="font-size: 22pt; font-weight: 600;">+</td>
                                ${rrr}
                                <td></td>
                            </tr>
                        </tbody>
                        `;

        const combinationshtml = combinations.map((c : MBCombination) =>
            html`${c.combinationText}<br>`
        );

        const component_footer = html`
                    </table>
                </div>    
            </div>    

            <div style="margin-top: 10vh; display: flex; flex-wrap: wrap; justify-content: space-around">
                <div id="generateCombinationButton"
                    style="background-color: white; width: 20vw; height: auto; text-align: center; font-family: 'sans-serif'; font-size: 1.1vw; margin-bottom: 20px; border-radius: 10px; cursor: pointer">
                    <h2 style="user-select: none">Save Combination</h2>
                </div>
            </div>

            <div class="folder-box">
                <div class="folder-tab">
                    Combinations
                </div>

                <div class="folder-body">
                    <div class="combinations">${combinationshtml}</div>
                </div>
            </div>
        `;

        return html`${component_header}
                ${table_header}
                ${table_body}
                ${component_footer}
                `;

    }

    connectedCallback() {
        store.pipe(
            map(model => ({ activeRoomId: model.activeRoomId, parameters: model.parameters, combinations: model.combinations })),
            distinctUntilChanged()
        ).subscribe(morphoRoom => {
            render(this.template(morphoRoom.activeRoomId, morphoRoom.parameters, morphoRoom.combinations), this.shadowRoot);
            this.addClickListeners();

            if (!this.parametersSaved) {
                this.saveAllParameters();
                this.parametersSaved = true;
            }
        });

        if (!this.isListenerAdded) {
            const generateCombinationButton = this.shadowRoot.getElementById('generateCombinationButton');
            generateCombinationButton.addEventListener('click', () => {
                this.generateCombination();
            });

            this.isListenerAdded = true;
        }
    }
}

customElements.define("morphological-box", MorphologicalBox);

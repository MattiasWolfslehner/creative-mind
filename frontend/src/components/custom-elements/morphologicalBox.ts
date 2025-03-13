import {html, nothing, render, TemplateResult} from "lit-html";
import {MBParameter, store} from "../../model";
import {distinctUntilChanged, map} from "rxjs";
import morphoService from "../../service/morpho-service";
import {MBRealization} from "../../model/mbrealization";
import {MBCombination} from "../../model/mbcombination";

export class MorphologicalBox extends HTMLElement {
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
            const z = morphoService.saveCombination(store.getValue().activeRoomId, store.getValue().thisUserId, combination.join(' | '));
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
    
        // Bestimme die maximale Anzahl an Realisierungen
        let realizations = 0;
        parameters.forEach((p) => {
            if (p.realizations) {
                realizations = Math.max(realizations, p.realizations.length);
            }
        });
    
        const component = html`
            <style>
                body {
                    background-color: #9D75EF;
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family: Arial, sans-serif;
                }
                
                #container {
                    width: 100vw;
                    display: flex;
                    justify-content: center;
                }
    
                .table-container {
                    margin-top: 3vw;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                table {
                    border-collapse: collapse;
                    width: 90vw;
                    border: 0.4vw solid #9D75EF;
                    background-color: #8d63d0;
                    border-radius: 0.5vw;
                    table-layout: fixed;
                }
                
                thead th, tbody td {
                    width: auto;
                    height: 7vw;
                    font-size: 1.5em;
                    color: white;
                    border: 0.3vw solid #9D75EF;
                    text-align: center;
                    vertical-align: middle;
                    padding: 0.5vw;
                    box-sizing: border-box;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    cursor: pointer;
                }
                
                thead th {
                    font-size: 2em;
                    font-weight: bold;
                    background-color: #7c52c3;
                }
                
                .selected-1 {
                    background-color: rgba(0, 0, 0, 0.5); //#F06568
                }
                
                .selected-2 {
                    background-color: rgba(0, 0, 0, 0.5); //#FFE76A
                }
                
                .selected-3 {
                    background-color: rgba(0, 0, 0, 0.5); //#7EEDE5
                }
    
                .placeholder {
                    opacity: 0.6;
                }
            
                .folder-box {
                    width: 85vw;
                    height: 65vw;
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
                    font-weight: bold;
                    font-size: 2em;
                    line-height: 6vh;
                }
            
                .folder-body {
                    padding: 2vw;
                    margin-top: 6vh;
                }
            </style>
            
            <div id="container">
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Parameter</th>
                                ${Array.from({ length: realizations }).map((_, i) => html`<th>Realization ${i + 1}</th>`)}
                                <th>(Realization ...)</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${parameters
                                .slice() // Eine Kopie des Arrays erstellen, um Mutabilitätsprobleme zu vermeiden
                                .sort((a, b) => (a.paramId > b.paramId ? 1 : -1)) // Sortiere Parameter alphabetisch oder numerisch
                                .map(
                                    (p) => html`
                                        <tr>
                                            <td paramId="${p.paramId}">${p.title}</td>
                                            ${this.generateRealizations(p, realizations)}
                                        </tr>
                                    `
                                )}
                            <tr>
                                <td style="font-size: 22pt; font-weight: 600;">+</td>
                                ${Array.from({ length: realizations }).map(() => html`<td></td>`)}
                                <td></td>
                            </tr>
                        </tbody>
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
                    <div class="combinations">
                        <h1>${combinations.map((c) => html`${c.combinationText}<br>`)}</h1>
                    </div>
                </div>
            </div>
        `;
    
        return component;
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

    /*getMorphologicalTableData(): { headers: string[], rows: string[][] } {
        const table = this.shadowRoot?.querySelector("table");
        if (!table) {
            console.error("Tabelle nicht gefunden!");
            return { headers: [], rows: [] };
        }

        const headers = Array.from(table.querySelectorAll("thead th")).map(th => th.textContent?.trim() || "");

        const rows = Array.from(table.querySelectorAll("tbody tr"))
            .slice(0, -1) // Letzte Zeile mit "+" ignorieren
            .map(row =>
                Array.from(row.querySelectorAll("td")).map(cell => cell.textContent?.trim() || "")
            );

        return { headers, rows };
    }*/
}

export function getMorphologicalTableData(): { headers: string[], rows: string[][] } {
        const table = document.querySelector("table");
        if (!table) {
            console.error("Tabelle nicht gefunden!");
            return { headers: [], rows: [] };
        }

        const headers = Array.from(table.querySelectorAll("thead th")).map(th => th.textContent?.trim() || "");

        const rows = Array.from(table.querySelectorAll("tbody tr"))
            .slice(0, -1) // Letzte Zeile mit "+" ignorieren
            .map(row =>
                Array.from(row.querySelectorAll("td")).map(cell => cell.textContent?.trim() || "")
            );

        return { headers, rows };
    }

customElements.define("morphological-box", MorphologicalBox);
export default MorphologicalBox

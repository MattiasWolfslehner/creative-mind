import { html, render } from "lit-html";
import {MBParameter, store} from "../../model";
import {distinctUntilChanged, map} from "rxjs";
import morphoService from "../../service/morpho-service";

class MorphologicalBox extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
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
            const combinations = this.shadowRoot.querySelector('.combinations');
            combinations.innerHTML += `${combination.join(' | ')}<br>`;
        } else {
            console.log("No selection made.");
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
    
        clickedCell.setAttribute('contenteditable', 'true');
        clickedCell.focus();
    
        clickedCell.addEventListener('blur', () => {
            clickedCell.removeAttribute('contenteditable');
    
            if (clickedCell.textContent.trim() === "") {
                if (columnIndex === 0) {
                    clickedCell.textContent = `Parameter ${rowIndex + 1}`;
                } else {
                    clickedCell.textContent = `Realization ${columnIndex}`;
                }
    
                clickedCell.classList.add('placeholder');
            } else {
                clickedCell.classList.remove('placeholder');
            }
        });
    }
    
    

    addClickListeners() {
        const parameters = this.shadowRoot.querySelectorAll('tbody tr:not(:last-child)')
        parameters.forEach(param => {
            param.addEventListener('dblclick', (event) => this.handleCellDblClick(event));
        })
        const cells = this.shadowRoot.querySelectorAll('tbody tr:not(:last-child) td:not(:first-child):not(:last-child)');
        cells.forEach(cell => {
            cell.addEventListener('click', (event) => this.handleCellClick(event));

            cell.addEventListener('dblclick', (event) => this.handleCellDblClick(event));
        });
    }

    template(activeRoomId:string, parameters: MBParameter[]) {
        if (!parameters) parameters = [];

        return html`
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
                    border: 5px solid #9D75EF;
                    background-color: #8d63d0;
                    border-radius: 5px;
                }
                
                thead th, tbody td {
                    width: 175px;
                    height: 60px;
                    font-size: 16pt;
                    color: white;
                    border: 5px solid #9D75EF;
                    text-align: center;
                    vertical-align: middle;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    padding: 0 10px;
                    box-sizing: border-box;
                    cursor: pointer;
                }
                
                thead th {
                    font-size: 22pt;
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
                    width: 1700px;
                    height: 600px;
                    background-color: #8d63d0;
                    border-radius: 0 10px 10px 10px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    position: relative;
                    margin: 50px auto;
                }
        
                .folder-tab {
                    position: absolute;
                    top: -40px;
                    left: 0;
                    width: 300px;
                    height: 60px;
                    background-color: #8d63d0;
                    border-radius: 10px 10px 0 0;
                    text-align: center;
                    color: white;
                    font-size: 24pt;
                    font-weight: bold;
                    line-height: 60px;
                }
        
                .folder-body {
                    padding: 20px;
                    margin-top: 60px;
                }
        
                .combinations {
                    color: #fff;
                    font-size: 16pt;
                }
            </style>

            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Parameter</th>
                            <th>Realization 1</th>
                            <th>Realization 2</th>
                            <th>Realization 3</th>
                            <th>Realization 4</th>
                            <th>Realization 5</th>
                            <th>+</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>${(parameters.length > 0)?parameters[0].title:"Power System"}</td>
                            <td>Electric</td>
                            <td>Petrol</td>
                            <td>Diesel</td>
                            <td class="placeholder">Realization 4</td>
                            <td class="placeholder">Realization 5</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>${(parameters.length > 1)?parameters[1].title:"Frame System"}</td>
                            <td>Vertical</td>
                            <td>Horizontal</td>
                            <td>Vertical/Horizontal</td>
                            <td class="placeholder">Realization 4</td>
                            <td class="placeholder">Realization 5</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>${(parameters.length > 2)?parameters[2].title:"Log Holding"}</td>
                            <td>Clamps</td>
                            <td>Clamps & Groove</td>
                            <td>Groove</td>
                            <td class="placeholder">Realization 4</td>
                            <td class="placeholder">Realization 5</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Splitting Device</td>
                            <td>Saw</td>
                            <td>Wedge</td>
                            <td class="placeholder">Realization 3</td>
                            <td class="placeholder">Realization 4</td>
                            <td class="placeholder">Realization 5</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Splitting Force</td>
                            <td>Manual Lever</td>
                            <td>Pneumatic Ram</td>
                            <td>Hydraulic Ram</td>
                            <td>Impact Force</td>
                            <td>Sawing</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Support/Transport</td>
                            <td>Wheels</td>
                            <td>Tyres</td>
                            <td>Tyres/Spikes</td>
                            <td>Sledge</td>
                            <td>Spikes</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td style="font-size: 22pt; font-weight: 600;">+</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div style="margin-top: 10vh; display: flex; flex-wrap: wrap; justify-content: space-around">
                <div id="generateCombinationButton"
                    style="background-color: white; width: 20vw; height: auto; text-align: center; font-family: 'sans-serif'; margin-bottom: 20px; border-radius: 10px">
                    <h2 style="user-select: none">Save Combination</h2>
                </div>
            </div>

            <div class="folder-box">
                <div class="folder-tab">
                    Combinations
                </div>

                <div class="folder-body">
                    <div class="combinations"></div>
                </div>
            </div>
        `;
    }

    connectedCallback() {

        const p = morphoService.getParameterForRoom(store.getValue().activeRoomId);
        //
        store.pipe(map( model => ({activeRoomId : model.activeRoomId, parameters: model.parameters}) ), distinctUntilChanged())
            .subscribe(morphoRoom => {
                render(this.template(morphoRoom.activeRoomId, morphoRoom.parameters), this.shadowRoot);
                this.addClickListeners();
                const generateCombinationButton = this.shadowRoot.getElementById('generateCombinationButton');
                generateCombinationButton.addEventListener('click', () => {
                    this.generateCombination();
                });
            });
    }
}

customElements.define("morphological-box", MorphologicalBox);

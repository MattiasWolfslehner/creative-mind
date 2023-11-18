// https://lit.dev/docs/tools/adding-lit/

import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import '../script/types'
import '../style/main.css';
import '../style/style.scss';

@customElement('idea-list')
export class IdeaList extends LitElement {

  protected ideas: Idea[] = [];

  constructor () {
    super();
  }

  public async setIdeas(ideas: Idea[]) {
    // Set a property, triggering an update
    this.ideas = ideas;

    this.requestUpdate();

    // ...do other stuff...
    return 'done';
  }

  override render() {
    console.log(`now render data`);

    let table = document.createElement('table');
    let thead =document.createElement("thead");
    let row = document.createElement("tr");
    let col = document.createElement("th");
    col.innerHTML="Id";
    row.appendChild(col);
    col = document.createElement("th");
    col.innerHTML="Content";
    row.appendChild(col);
    thead.appendChild(row);
    table.appendChild(thead);
    let tbody = document.createElement("tbody");

    this.ideas.map((idea) => {
      let row = document.createElement('tr');
      let col = document.createElement('td');
      col.innerHTML = idea.id.toString();
      row.appendChild(col);
      col = document.createElement('td');
      col.innerHTML = idea.content.toString();
      row.appendChild(col);
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    const page = html`
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        ${table}
    `;

    return(page);
  }
}


customElements.define('idea-list', IdeaList);

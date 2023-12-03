// https://lit.dev/docs/tools/adding-lit/

import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {Idea} from '../script/types';
import '../style/main.css';
import '../style/style.scss';

@customElement('idea-list')
export class IdeaList extends LitElement {
  protected ideas: Idea[] = [];

  constructor() {
    super();
  }

  public async setIdeas(ideas: Idea[]) {
    // Set a property, triggering an update
    this.ideas = ideas;
    // re-render after update
    this.requestUpdate();
    // ...do other stuff...
    return 'done';
  }

  override render() {
    return html`
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>
          ${this.ideas.map(
            (i) => html`
              <tr>
                <td>${i.id?i.id.toString():"null"}</td>
                <td>
                  ${i.content.toString().length > 40
                    ? i.content.toString().substring(1, 40) + '...'
                    : i.content.toString()}
                </td>
              </tr>
            `,
          )}
        </tbody>
      </table>
    `;
  }
}

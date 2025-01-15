// https://lit.dev/docs/tools/adding-lit/

import {LitElement, html, css, unsafeCSS} from 'lit';
import {customElement} from 'lit/decorators.js';
import {Idea} from '../script/types';

@customElement('idea-list')
export class IdeaList extends LitElement {
  protected ideas: Idea[] = [];

  constructor() {
    super();
  }

  static override get styles() {
    return [
      css`
        ${unsafeCSS(require('../style/style.scss'))}
      `,
      css`
        ${unsafeCSS(require('../style/main.css'))}
      `,
      css`
        .my-lit-button {
          -webkit-appearance: button;
          background-color: transparent;
          padding: 0;
          --border-color: var(--primary);
          border: 1px solid #fff;
          border-radius: 5px;
        }
      `,
      css``,
    ];
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
                <td>${i.id ? i.id.toString() : 'null'}</td>
                <td>
                  ${i.content
                    ? i.content.toString().length > 40
                      ? i.content.toString().substring(1, 40) + '...'
                      : i.content.toString()
                    : 'null'}
                </td>
              </tr>
            `,
          )}
        </tbody>
      </table>
    `;
  }
}

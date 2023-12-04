// https://lit.dev/docs/tools/adding-lit/

import {LitElement, html, unsafeCSS, css} from 'lit';
import {customElement} from 'lit/decorators.js';

@customElement('idea-create')
export class IdeaCreate extends LitElement {
  protected content: string = "";

  constructor() {
    super();
  }

  static override get styles() {
    return [
        css`${unsafeCSS(require("../style/style.scss"))}`,
        css`${unsafeCSS(require("../style/main.css"))}`,
        css`
          #add-idea {
            -webkit-appearance: button;
            background-color: transparent;
            padding: 0;
            --border-color: var(--primary);
            border: 1px solid #fff;
            border-radius: 5px;
          }
        `,
        css``
    ];
  }
  private async _createClick() {
    this.content = '';
    if (this.shadowRoot) {
      const ttt = this.shadowRoot.getElementById(
          'idea',
      ) as HTMLInputElement;
      this.content = ttt.value.trim();
      ttt.value = ''; // reset input
    }
    if (this.content.length > 0) {
      const event = new CustomEvent<string>('pressed-create', {detail: this.content});
      this.dispatchEvent(event);      // and delete message from input
    } else {
      console.log('no idea to send! ...' + this.content);
      //this.sendMessageToServer("nothing to send!"); // fake message for test
    }

  }
  override render() {
    return html`
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      
      <textarea id="idea" name="idea" placeholder="your idea..."></textarea>
      <button id="add-idea" @click="${() => this._createClick()}">hinzufügen</button>
    `;
  }
}

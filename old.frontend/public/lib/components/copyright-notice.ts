// https://lit.dev/docs/tools/adding-lit/

import {LitElement, html} from 'lit';

class CopyrightNotice extends LitElement {
  override render() {
    return html`© ${new Date().getFullYear()} Creative Mind`;
  }
}

customElements.define('copyright-notice', CopyrightNotice);

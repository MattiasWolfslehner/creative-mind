// https://lit.dev/docs/tools/adding-lit/
// import it in the page.js file and use it with the name defined in the last row

import {LitElement, html} from 'lit';

class MyElement extends LitElement {
  render() {
    return html` <div>Hello from MyElement!</div> `;
  }
}

customElements.define('my-element', MyElement);

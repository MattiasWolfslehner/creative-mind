// https://lit.dev/docs/tools/adding-lit/

import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import '../script/types';
import '../style/main.css';
import '../style/style.scss';


export class MyEvent extends Event {

  protected message: string|null;
  constructor(message: string|null) {
    super('my-event');
    this.message = message;
  }

}

@customElement('room-list')
export class RoomList extends LitElement {

  protected rooms: Room[] = [
  ];

  constructor () {
    super();

    // some example rooms
    let r: Room = {
      cmuuid : "77642b38-0c8f-4685-93b7-8847bf443ce0"
    };
    this.rooms.push(r);
    r = {
      cmuuid : "4970bda3-9cbb-4508-972b-1c4a754ad268"
    };
    this.rooms.push(r);
  }

  public async setRooms(rooms: Room[]) {
    // Set a property, triggering an update
    this.rooms = rooms;
    // now re-render
    this.requestUpdate();
    // ...do other stuff...
    return 'done';
  }

  private async _roomJoined(e: Event) {
    console.log(e.target);
    const event = new MyEvent('...');
    this.dispatchEvent(event);
  }
  override render() {
    return html`
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <table>
    <thead>
      <tr>
        <th>Room</th>
        <th>Join</th>
      </tr>
    </thead>
    <tbody>
      ${this.rooms.map(i => html`
      <tr>
        <td>${i.cmuuid}</td>
        <td><button id="_room_${i.cmuuid}" @click="${this._roomJoined}">Join</button></td>
      </tr>
      `)}
    </tbody>
  </table>
  `;


//      col.innerHTML = `<p></p><button onclick="${this._roomJoined}">Join</button></p>`;
  }
}



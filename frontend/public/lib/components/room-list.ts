// https://lit.dev/docs/tools/adding-lit/

import {LitElement, html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {Room} from '../script/types';
import '../style/main.css';
import '../style/style.scss';

@customElement('room-list')
export class RoomList extends LitElement {
  protected rooms: Room[] = [];

  constructor() {
    super();

    // // some example rooms
    // let r: Room = {
    //   cmuuid : 'd79ed48c-b089-43f1-9fa6-d49b7029b69e'
    // };
    // this.rooms.push(r);
    // r = {
    //   cmuuid : '3cc3c738-856d-4e35-85da-0b41935aa2a5'
    // };
    // this.rooms.push(r);
  }

  public async setRooms(rooms: Room[]) {
    // Set a property, triggering an update
    this.rooms = rooms;
    // now re-render
    this.requestUpdate();
    // ...do other stuff...
    return 'done';
  }

  // dispatch the received button click as a "join-the-room" event
  private async _roomJoined(room: string) {
    const event = new CustomEvent<string>('room-joined', {detail: room});
    this.dispatchEvent(event);
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
            <th>Room</th>
            <th>Type</th>
            <th>Join</th>
          </tr>
        </thead>
        <tbody>
          ${this.rooms.map(
            (i) => html`
              <tr>
                <td>${i.id}</td>
                <td>${i.roomId}</td>
                <td>${i.type}</td>
                <td>
                  <button
                    id="_room_${i.roomId}" class="room-join-button"
                    @click="${() => this._roomJoined(i.roomId)}">
                    Join
                  </button>
                </td>
              </tr>
            `,
          )}
        </tbody>
      </table>
    `;
  }
}

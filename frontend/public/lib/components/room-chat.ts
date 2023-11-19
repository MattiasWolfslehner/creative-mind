// https://lit.dev/docs/tools/adding-lit/

import {LitElement, html, nothing} from 'lit';
import {customElement} from 'lit/decorators.js';
import '../script/types';
import '../style/main.css';
import '../style/style.scss';


@customElement('room-chat')
export class RoomChat extends LitElement {

  protected roomId: string|null = null;
  protected userId: string|null = null;
  protected socket: WebSocket | null = null;

  protected messages: string = "";

  private sendMessageToServer(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket connection is not open.');
    }
  }

  private _handleWebSocketMessage(event: MessageEvent) {
    const message: string = event.data;
    console.log("Received message:", message);
    this.messages += `<p>${message}</p>`;
    this.requestUpdate();
  }

  constructor () {
    super();
  }

  public async setUserAndRoom(roomId:string, userId:string) {
    // Set a property, triggering an update
    this.roomId = roomId;
    this.userId = userId;
    this.socket = new WebSocket(`ws://localhost:8080/rooms/join/${roomId}/${userId}`);

    this.socket.onopen = function (event: Event) {
      console.log("WebSocket connection opened:", event);
    };
    this.socket.onmessage = this._handleWebSocketMessage;

    this.socket.onclose = function (event:Event) {
      console.log("WebSocket connection closed:", event);
    };

    this.socket.onerror = function (error:Event) {
      console.error("WebSocket error:", error);
    };

    // now re-render
    this.requestUpdate();
    // ...do other stuff...
    return 'done';
  }

  // dispatch the received button click as a "join-the-room" event
  private async _sendMessage() {
    let message: string = "abc";
    this.sendMessageToServer(message);
  }

  override render() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {

    return html`
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <div>
    ${this.messages}
    <input id="message" type="text">
    <button id="send-message" @click="${() => this._sendMessage()}"></button>
  </div>
  `;
    }
    else
      return nothing;
  }
}



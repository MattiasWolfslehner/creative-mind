// https://lit.dev/docs/tools/adding-lit/

import {LitElement, html} from 'lit';
import {customElement,property} from 'lit/decorators.js';
import '../script/types';
import '../style/main.css';
import '../style/style.scss';


@customElement('room-chat')
export class RoomChat extends LitElement {

  @property() actual_message: string;

  protected roomId: string|null = null;
  protected userId: string|null = null;
  protected socket: WebSocket | null = null;

  protected messages: string;

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
    this.actual_message = "";

    this.messages = "";
  }

  public async setUserAndRoom(roomId:string, userId:string) {
    // Set a property, triggering an update
    this.roomId = roomId;
    this.userId = userId;
    this.messages = "";
    this.actual_message = "";

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
    if (this.actual_message.trim().length > 0) {
      this.sendMessageToServer(this.actual_message);
    }
    else {
      console.log("nothing to send!")
    }
  }

  override render() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {

    return html`
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <div>
    <h2>Chat</h2>
    <p>${this.messages}</p>
    <input type="text" .value="${this.actual_message}">
    <button id="send-message" @click="${() => this._sendMessage()}"></button>
  </div>
  `;
    }
    else
      return html`<div><h2>no chat so far</h2></div>`;
  }
}



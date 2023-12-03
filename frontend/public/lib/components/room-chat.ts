// https://lit.dev/docs/tools/adding-lit/

import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
// import {live} from 'lit/directives/live.js';
import '../script/types';
import '../style/main.css';
import '../style/style.scss';

@customElement('room-chat')
export class RoomChat extends LitElement {
  @property() messages: string;

  protected roomId: string | null = null;
  protected userId: string | null = null;
  protected socket: WebSocket | null = null;

  private returnString() {
    return document.createRange().createContextualFragment(`${this.messages}`);
  }
  private sendMessageToServer(message: string) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.error('WebSocket connection is not open.');
    }
  }

  private async _handleWebSocketMessage(event: MessageEvent) {
    event.preventDefault();
    const message: string = event.data;
    const oldMessages = this.messages;
    console.log('Received message:', message);
    this.messages = oldMessages + `<p>${message}</p>`;
  }

  constructor() {
    super();
    this.messages = '';
  }

  public async setUserAndRoom(roomId: string | null, userId: string | null) {
    // Set a property, triggering an update
    this.roomId = roomId;
    this.userId = userId;
    this.messages = '';

    // baba.
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }

    this.socket = null;

    if (roomId && userId) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const roomChatContext: RoomChat = this; // not to be mistaken with websocket inside

      this.socket = new WebSocket(
          `ws://localhost:8080/rooms/join/${roomId}/${userId}`,
      );

      this.socket.onopen = function (event: Event) {
        event.preventDefault();
        console.log('WebSocket connection opened:', event);
      };
      this.socket.onmessage = function (ev: MessageEvent) {
        roomChatContext._handleWebSocketMessage(ev);
      };

      this.socket.onclose = function (event: Event) {
        event.preventDefault();
        console.log('WebSocket connection closed:', event);
      };

      this.socket.onerror = function (error: Event) {
        error.preventDefault();
        console.error('WebSocket error:', error);
      };

    }
    // ...do other stuff...
    return 'done';
  }

  // dispatch the received button click as a "join-the-room" event
  private async _sendMessage() {
    let message: string = '';
    if (this.shadowRoot) {
      const ttt = this.shadowRoot.getElementById(
        'message-text',
      ) as HTMLInputElement;
      message = ttt.value.trim();
      ttt.value = ''; // reset input
    }
    if (message.length > 0) {
      this.sendMessageToServer(message);
      // and delete message from input
    } else {
      console.log('nothing to send! ...' + message);
      //this.sendMessageToServer("nothing to send!"); // fake message for test
    }
  }

  // private _keydown (event:KeyboardEvent) {
  //   console.log(event);
  //
  //   if (event.key == 'Enter') {
  //     this._sendMessage();
  //   }
  // }
  override render() {
    // keep for later:  <!--onkeydown="${(event:KeyboardEvent) => this._keydown(event)}" -->
    return html`
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css" />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      <div>
        <h2>Chat</h2>
        <p>${this.returnString()}</p>
        <input id="message-text" type="text" />
        <button id="send-message" @click="${() => this._sendMessage()}">
          Send
        </button>
      </div>
    `;
  }
}

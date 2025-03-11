import { html, render } from "lit-html";
import { store } from "../../model";
import { Model, Room } from "src/model";
import { produce } from "immer";
import roomService from "../../service/room-service";
import { router } from "../../../router";
import { distinctUntilChanged, map } from "rxjs";

class RoomList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  template(rooms, userId) {
    const roomTemplates = rooms
      .filter((room) => room.adminId === userId)
      .map((room) => html`
        <div class="room-card">
          <div class="room-info">
            <p><strong>ID:</strong> ${room.roomId}</p>
            <p><strong>Name:</strong> ${room.name}</p>
            <p><strong>Description:</strong> ${room.description}</p>
            <p><strong>State:</strong> ${room.roomState}</p>
            <p><strong>Type:</strong> ${room.type}</p>
          </div>
          <div style="width: 20vw; display: flex; justify-content: space-around">
          ${["OPEN", "CREATED"].includes(room.roomState)
            ? html`
                <button
                  class="join-button"
                  @click="${() => this._roomJoined(room.roomId)}"
                >
                  Join
                </button>
              `
            : ""}
            ${["OPEN", "CREATED"].includes(room.roomState)
              ? html`
                  <button
                    class="join-button"
                    @click="${() => this._deleteRoom(room.roomId)}"
                  >
                    Delete
                  </button>
                `
              : ""}
          </div>
        </div>
      `);

    return html`
    <style>
        h1 {
            font-size: 2em;
            color: #333;
            text-align: center;
            margin-bottom: 2vw;
        }

        .room-list-container {
            margin-top: 3vw;
            display: flex;
            flex-wrap: wrap;
            gap: 2vw;
            justify-content: center;
        }

        .room-card {
            position: relative;
            background-color: #7eede5;
            width: 30vw;
            max-width: 300px;
            padding: 2vw;
            box-shadow: 0 0.5vw 1vw rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            text-align: left;
            transform: rotate(-1deg);
        }

        .room-card:nth-child(3n + 1) {
            background-color: #f06568;
        }

        .room-card:nth-child(3n + 2) {
            background-color: #ffe76a;
        }

        .room-card::before {
            content: '';
            position: absolute;
            top: -1vw;
            left: 50%;
            transform: translateX(-50%);
            width: 1.5vw;
            height: 1.5vw;
            background-color: black;
            border-radius: 50%;
            box-shadow: 0 0.2vw 0.5vw rgba(0, 0, 0, 0.3);
        }

        .room-info p {
            margin: 0.5em 0;
            color: #333;
        }

        .room-info strong {
            color: #000;
        }

        .join-button {
            background-color: #333;
            color: white;
            border: none;
            border-radius: 0.5vw;
            padding: 0.8em 1.2em;
            font-size: 1em;
            cursor: pointer;
            align-self: center;
            transition: background-color 0.3s ease;
        }

        .join-button:hover {
            background-color: #555;
        }

        #showRoomButton {
            background-color: #fff;
            font-size: 1.2em;
            padding: 1em 2em;
            margin: 2vw auto;
            text-align: center;
            cursor: pointer;
            border: none;
            border-radius: 0.5vw;
            width: fit-content;
        }

        #showRoomButton:hover {
            background-color: #eee;
        }

        #container {
          margin-top: 1vw;
          width: 100vw;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
            .room-card {
                width: 80vw;
                transform: rotate(0deg); /* Remove rotation on smaller screens */
            }

            .join-button {
                font-size: 0.9em;
            }

            h1 {
                font-size: 1.5em;
            }
        }
  </style>


    <h1 style="margin-top: 6vw; margin-bottom: -0.5vw; color: white; font-family: 'sans-serif';">Room List</h1>
    <hr style="border: 2px solid #8D63D0; width: 65vw;">
    <div class="room-list-container">${roomTemplates}</div>
    <div id="container">
        <button id="showRoomButton">Back to Homepage</button>
    </div>
    `;
  }

  connectedCallback() {
    store
      .pipe(
        map((model) => ({
          userId: model.thisUserId,
          rooms: model.rooms,
        })),
        distinctUntilChanged()
      )
      .subscribe((modelValues) => {
        render(this.template(modelValues.rooms, modelValues.userId), this.shadowRoot);
      });

    this.addClickEventListeners();
  }

  addClickEventListeners() {
    const showRoomButton = this.shadowRoot.getElementById("showRoomButton");
    showRoomButton.addEventListener("click", () => {
      const model = produce(store.getValue(), (draft) => {
        draft.isRoomList = false;
        draft.activeRoomId = "";
      });
      store.next(model);
    });
  }

  async _roomJoined(roomId) {
    console.log(`Joining room with room id: ${roomId}`);
    router.navigate(`/room/${roomId}`);
  }

  async _deleteRoom(roomId) {
    try {
        console.log(`Deleting room with room id: ${roomId}`);

        const response = await fetch(`http://localhost:8080/api/rooms/remove/${roomId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem("token")
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to delete room: ${response.statusText}`);
        }

        console.log(`Room with ID ${roomId} deleted successfully.`);

        location.reload()
    } catch (error) {
        console.error(`Error deleting room: ${error.message}`);
    }
  }
}

customElements.define("room-list", RoomList);

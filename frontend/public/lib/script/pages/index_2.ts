import '../../style/main.css';
import '../../style/style.scss';
import '../types';

import {IdeaList} from '../../components/idea-list';
import {RoomList} from '../../components/room-list';

import { localStorageAction } from '../actions/store';
import {RoomChat} from "../../components/room-chat";

const loginForm = document.getElementById('login-form') as HTMLFormElement;
const userInput = document.getElementById('user-input') as HTMLInputElement;
const loginButton = document.getElementById('login-button') as HTMLFormElement;
const registerButton = document.getElementById('register-button') as HTMLFormElement;
const createRoomButton = document.getElementById('create-room-button') as HTMLFormElement;
const ideaForm2 = document.getElementById('idea-form2') as HTMLFormElement;
const downloadCsvBtn = document.getElementById('download-csv') as HTMLAnchorElement;
const copyButton = document.getElementById('copy-room-id-button') as HTMLButtonElement;
const roomIdElement = document.getElementById('room-id') as HTMLElement;
const ideaList2 = document.getElementById("idea-list2") as IdeaList;
const roomChat = document.getElementById("room-chat") as RoomChat;
const roomList = document.getElementById("room-list") as RoomList;

const restPort = 8080;
let roomId: string | null = null;
let userId: string | null = null;

roomList.addEventListener('room-joined'
    , async function (event) {
    const selectedRoomId = (<CustomEvent>event).detail;
    console.log(selectedRoomId);
    await localStorageAction.save('roomId', selectedRoomId);
    roomId = selectedRoomId;
    if (userId) {
        roomChat.setUserAndRoom(selectedRoomId, userId);
    }
    await updateUI();
    await getIdeas();
});



async function getRooms() {
  const action = `http://localhost:${restPort}/api/rooms/list`;

  if (userId) {
      fetch(action, {
          headers: {
              Accept: 'application/json',
          },
          method: 'GET',
      })
          .then((response) => response.json())
          .then((data) => {
              //console.log(data);
              roomList.setRooms(data);
          })
          .catch((error) => {
              console.log(error);
          });
  }
  else {
      await roomList.setRooms([]);
  }
}

async function updateUI() {
  ideaForm2.classList.toggle('hidden');
  console.log(roomId);

  if (roomId) {
      copyButton.addEventListener('mouseenter', () => {
          if (roomIdElement) {
              roomIdElement.style.display = 'block';
              roomIdElement.innerHTML = roomId || '';
          }
      });

      copyButton.addEventListener('mouseleave', () => {
          if (roomIdElement) {
              roomIdElement.style.display = 'none';
          }
      });
  }

  await getRooms();
}


// der LOGIN für einen USER
loginForm.addEventListener('submit', function (event) {
  event.preventDefault();// prevent POSTback
  event.stopImmediatePropagation();
  //console.log(event);

  const action = `http://localhost:${restPort}/api/users/list`;
  //console.log(userInput);
  userId = userInput?.value;
  console.log(`USER: ${userId}`);

  if (userId) {
      fetch(action, {
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          method: 'GET'
      })
          .then((response) => response.json())
          .then((response) => {
              let userList: User[] = response;
              // console.log(userList);
              for (var usr of userList) {
                if (usr.userId == userId) {
                    console.log("user logged in")
                    // if everything goes right ... cancel user Input and let him/her create rooms
                    userInput.setAttribute("readonly", "readonly");
                    loginButton.classList.add("hidden");
                    registerButton.classList.add("hidden");
                    createRoomButton.classList.remove("hidden");
                    ideaForm2.classList.remove("hidden");
                    getRooms();
                    getIdeas();
                    // now user logged in can create rooms
                    return;
                }
            }
            userId = null;
            alert("User not found. Please try different User Id.");
        })
        .catch((error) => {
            console.log(error);
        });
  }
});


// des REGISTER  für einen NEUEN USER
registerButton.addEventListener('click', function (event) {
    event.preventDefault();// prevent POSTback
    event.stopImmediatePropagation(); // prevent second coll from div
    //console.log(event);

    const action = `http://localhost:${restPort}/api/users/register`;
    //console.log(userInput);
    userInput.value = "Try register";
    userId = null;

    fetch(action, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        method: 'POST',
        body: "{}"
    })
        .then((response) => response.json())
        .then((response) => {
            let newUser: User = response;
            userId = newUser.userId;
            userInput.value = userId;
            console.log(`user logged in ${userId}`)
            userInput.setAttribute("readonly", "readonly");
            loginButton.classList.add("hidden");
            registerButton.classList.add("hidden");
            createRoomButton.classList.remove("hidden");
            ideaForm2.classList.remove("hidden");
            getRooms();
            getIdeas();
        })
        .catch((error) => {
            console.log(error);
        });
});


//
// create new room
createRoomButton.addEventListener('click', function (event) {
    event.stopImmediatePropagation();// stop second click
    //console.log(event);

    if (userId) {
        const action = `http://localhost:${restPort}/api/rooms/create`;
        fetch(action, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({type: "brainwritingroom"})
        })
            .then((response) => response.json())
            .then(() => {
                getRooms();
            })
            .catch((error) => {
                console.log(error);
            });
    }
});

// add idea
ideaForm2.addEventListener('submit', function (event) {
  event.preventDefault();
  event.stopImmediatePropagation();

  if (roomId) {
    const action = `http://localhost:${restPort}/api/ideas/`;
    const formData = new FormData(event.target as HTMLFormElement);
    const content: string | null = formData.get('idea') as string | null;

    fetch(action, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({content: content, roomId: roomId, memberId: userId}),
    })
        .then((response) => response.json())
        .then((/*response*/) => {
          //console.log(response);
          getIdeas();
        })
        .catch((error) => {
          console.log(error);
        });
  }
  else {
    console.log("no ROOM! in submit Idea");
    alert("Please join a room first!");
    getIdeas();
  }
});

// fetch ideas
window.addEventListener('DOMContentLoaded', async function () {
  roomId =  await localStorageAction.load('roomId');

  if (roomId && roomId.length > 0) {
      await updateUI();
  }
  else {
      await getIdeas();
  }
});

async function getIdeas() {
  roomId = await localStorageAction.load('roomId');
  if (roomId) {
    const action = `http://localhost:${restPort}/api/ideas/` + roomId;

    fetch(action, {
      headers: {
        Accept: 'application/json',
      },
    })
        .then((response) => response.json())
        .then((data) => {
          //console.log(data);
          ideaList2.setIdeas(data);
        })
        .catch((error) => {
          console.log(error);
        });
  }
  else {
      ideaList2.setIdeas([]);
      console.log("no ROOM! in getIdeas");
  }
}

downloadCsvBtn.addEventListener('click', downloadFile);

async function downloadFile() {
  // const roomId = await localStorageAction.load('roomId');

  // console.log(`roomId (button): ${roomId}`);
  //
  // const href = `http://localhost:${restPort}/api/ideas/${roomId}/download/csv`;
  // const fileName = `ideas-${Date.now()}`;
  //
  // const response = await fetch(href);
  // const blob = await response.blob();
  //
  // const suggestedFileName = prompt('Gib einen Dateinamen ein:', fileName);
  //
  // if (suggestedFileName) {
  //   const downloadLink = document.createElement('a');
  //   downloadLink.href = URL.createObjectURL(blob);
  //   downloadLink.download = suggestedFileName + '.csv';
  //
  //   document.body.appendChild(downloadLink);
  //   downloadLink.click();
  //   document.body.removeChild(downloadLink);
  // }
}
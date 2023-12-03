// Styling
import '../../style/main.css';
import '../../style/style.scss';

// General
import {localStorageAction} from '../actions/store';
import {RoomRequest} from '../types';

// ShoelaceUI
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/themes/dark.css';
import '@shoelace-style/shoelace/dist/components/qr-code/qr-code.js';
import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path.js';
setBasePath('/dist/shoelace');

// Custom Components

import {IdeaCreate} from "../../components/idea-create";
import {IdeaList} from '../../components/idea-list';
import {RoomList} from '../../components/room-list';
import {RoomChat} from '../../components/room-chat';

import {addIdea, addRoom, addUser, getDownload, getIdeas, getRooms, getUsers} from "../api/api";

const loginForm = document.getElementById('login-form') as HTMLFormElement;
const userInput = document.getElementById('user-input') as HTMLInputElement;
const loginButton = document.getElementById('login-button') as HTMLFormElement;
const registerButton = document.getElementById(
    'register-button',
) as HTMLFormElement;
const createRoomButton = document.getElementById(
    'create-room-button',
) as HTMLFormElement;



// const ideaForm2 = document.getElementById('idea-form2') as HTMLFormElement;
const downloadCsvBtn = document.getElementById(
    'download-csv',
) as HTMLAnchorElement;
const copyButton = document.getElementById(
    'copy-room-id-button',
) as HTMLButtonElement;


const roomIdElement = document.getElementById('room-id') as HTMLElement;

const ideaCreate = document.getElementById('idea-create') as IdeaCreate;
const ideaList2 = document.getElementById('idea-list2') as IdeaList;
const roomChat = document.getElementById('room-chat') as RoomChat;
const roomList = document.getElementById('room-list') as RoomList;

let roomId: string | null = null;
let userId: string | null = null;

roomList.addEventListener('room-joined', async function (event) {
    const selectedRoomId = (<CustomEvent>event).detail;
    console.log(`selected room ${selectedRoomId}`);
    await localStorageAction.save('roomId', selectedRoomId);
    roomId = selectedRoomId;
    if (userId) {
        await roomChat.setUserAndRoom(selectedRoomId, userId);
    }
    await updateUI();
    await getIdeasForComponent();
});

async function getRoomsForComponent() {
    if (userId) {
        getRooms()
            .then((data) => {
                roomList.setRooms(data);
            });
    } else {
        await roomList.setRooms([]);
    }
}

async function updateUI() {
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

    await getRoomsForComponent();
}


function setUserOfPage(newUserId:string) {
    userId = newUserId;
    userInput.value = newUserId;
    roomId = null;
    localStorageAction.save('roomId', roomId);
    ideaList2.setIdeas([]);
    userInput.setAttribute('readonly', 'readonly');
    loginButton.classList.add('hidden');
    registerButton.classList.add('hidden');
    createRoomButton.classList.remove('hidden');
    roomList.classList.remove('hidden');
    roomChat.classList.remove('hidden');
    ideaCreate.classList.remove('hidden');
    ideaList2.classList.remove('hidden');
}

// LOGIN for a single USER
loginForm.addEventListener('submit', function (event) {
    event.preventDefault(); // prevent POST back
    event.stopImmediatePropagation();

    userId = userInput?.value;
    console.log(`USER: ${userId}`);

    if (userId) {
        getUsers()
            .then((userList) => {
                for (const usr of userList) {
                    if (usr.userId == userId) {
                        console.log('user logged in');
                        // if everything goes right ... cancel user Input and let him/her create rooms
                        setUserOfPage(usr.userId);
                        getRoomsForComponent();
                        getIdeasForComponent();
                        // now user logged in can create rooms
                        return;
                    }
                }
                userId = null;
                alert('User not found. Please try different User Id.');
            })
            .catch((error) => {
                console.log(error);
            });
    }
});

//  REGISTER  for a single new USER
registerButton.addEventListener('click', function (event) {
    event.preventDefault(); // prevent POST back
    event.stopImmediatePropagation(); // prevent second coll from div

    // reset room and user
    userInput.value = 'Try register';
    userId = null;

    addUser()
        .then((newUser) => {
            if (newUser) {
                console.log(`user logged in ${newUser.userId}`);
                setUserOfPage(newUser.userId);
                getRoomsForComponent();
                getIdeasForComponent();
            }
            else {
                alert ("Registration failed!");
            }
        })
        .catch((error) => {
            console.log(error);
        });
});

//
// create new room
createRoomButton.addEventListener('click', function (event) {
    event.stopImmediatePropagation(); // stop second click
    //console.log(event);

    if (userId) {
        addRoom('brainwritingroom')
            .then(() => {
                getRoomsForComponent();
            })
            .catch((error) => {
                console.log(error);
            });
    }
});

// add idea
ideaCreate.addEventListener('pressed-create', function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const newIdea = (<CustomEvent>event).detail;
    console.log(`new IDEA ${newIdea}`);

    if (roomId && userId) {

        const request: RoomRequest = {
            content : newIdea,
            roomId : roomId,
            memberId : userId
        };

        addIdea(request)
            .then((/*response*/) => { // do not need response
                //console.log(response);
                getIdeasForComponent();
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        console.log('no ROOM! in submit Idea');
        alert('Please join a room first!');
        getIdeasForComponent();
    }
});

// fetch ideas
window.addEventListener('DOMContentLoaded', async function () {
    roomId = await localStorageAction.load('roomId');

    if (roomId && roomId.length > 0) {
        await updateUI();
    } else {
        await getIdeasForComponent();
    }
});

async function getIdeasForComponent() {
    roomId = await localStorageAction.load('roomId');
    if (roomId) {
        getIdeas(roomId)
            .then((data) => {
                //console.log(data);
                ideaList2.setIdeas(data);
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        await ideaList2.setIdeas([]);
        console.log('no ROOM! in getIdeasForComponent');
    }
}

downloadCsvBtn.addEventListener('click', downloadFile);

async function downloadFile() {
    const fileName = `ideas-${Date.now()}`;

    if (roomId) {
        getDownload(roomId)
            .then((blob) => {

                if (blob) {
                    const suggestedFileName = prompt('Please Enter Filename:', fileName);

                    if (suggestedFileName) {
                        const downloadLink = document.createElement('a');
                        downloadLink.href = URL.createObjectURL(blob);
                        downloadLink.download = suggestedFileName + '.csv';

                        document.body.appendChild(downloadLink);
                        downloadLink.click();
                        document.body.removeChild(downloadLink);
                    }
                }
                else {
                    alert("Nothing to download!");
                }
            });
    }
    else {
        alert("No room joined so far!");
    }
}
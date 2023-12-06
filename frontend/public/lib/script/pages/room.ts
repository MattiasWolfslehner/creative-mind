import '../../style/main.css';
import '../../style/style.scss';

import {addUser, getUsers} from "../api/api";

const userInput = document.getElementById('user') as HTMLInputElement;
const loginButton = document.getElementById('login') as HTMLFormElement;
const roomInput = document.getElementById('room') as HTMLInputElement;
const registerButton = document.getElementById(
    'register',
  ) as HTMLFormElement;

let userId: string | null = null;

userInput.addEventListener("input", function() {
  userInput.title = userInput.value;
});

loginButton.addEventListener('click', function (event) {
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
                      alert('Succesfully logged in.');
                      // if everything goes right ... cancel user Input and let him/her create rooms
                      setUserOfPage(usr.userId);
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

roomInput.addEventListener("input", function() {
  roomInput.title = roomInput .value;
});


registerButton.addEventListener('click', function (event) {

  event.preventDefault(); // prevent POST back
  event.stopImmediatePropagation(); // prevent second coll from div

  // reset room and user
  if (userId) {
    userId = null;
  }

  addUser()
      .then((newUser) => {
          if (newUser) {
              console.log(`user logged in ${newUser.userId}`);
              setUserOfPage(newUser.userId);
          }
          else {
              alert ("Registration failed!");
          }
      })
      .catch((error) => {
          console.log(error);
      });

  const newHTMLContent = `
    <div style="position: absolute; left: 20%; top: 25vh; width: 60vw; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <h2 class="text-4xl text-white font-spinnaker">Kreativitätstechnik</h2>
        <hr class="border-inputfieldBorderPurple border-5 border-t-5">
    </div>        
    <div style="display: flex; justify-content: space-between; position: absolute; left: 20%; top: 35vh; width: 60vw; height: 7vh; margin-right: 5%;">
        <div id="brainwriting" role="button" class="flex-grow w-full max-w-[360px] h-full px-4 py-2 text-black text-2xl font-spinnaker bg-white border-5 border-black rounded"
            style="display: flex; align-items: center; justify-content: center;">6-3-5</div>
            <div id="mindmapping" role="button" class="flex-grow w-full max-w-[360px] h-full px-4 py-2 text-white text-2xl font-spinnaker bg-inputfieldPurple border-5 border-inputfieldBorderPurple rounded"
            style="display: flex; align-items: center; justify-content: center;">MindMap</div>
            <div id="zwicky" role="button" class="flex-grow w-full max-w-[360px] h-full px-4 py-2 text-white text-2xl font-spinnaker bg-inputfieldPurple border-5 border-inputfieldBorderPurple rounded"
            style="display: flex; align-items: center; justify-content: center;">Zwicky-Box</div>
    </div>
    <div style="display: flex; justify-content: center; position: absolute; left: 20%; bottom: 25vh; width: 60vw; height: 7vh; margin-right: 5%;">
        <div id="create-room-button" role="button" class="flex-grow w-full max-w-[360px] h-full px-4 py-2 text-black text-2xl font-spinnaker bg-white border-5 border-black rounded"
            style="display: flex; align-items: center; justify-content: center;">Create Room</div>
    </div>`;
  
    const mainContainer = document.getElementById('mainContainer');
    if (mainContainer) {
        mainContainer.innerHTML = newHTMLContent;
    }
  });

  function setUserOfPage(newUserId:string) {
    userId = newUserId;
  }

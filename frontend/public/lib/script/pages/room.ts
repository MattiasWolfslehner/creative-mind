import '../../style/main.css';
import '../../style/style.scss';

import {User} from '../types';

const registerButton = document.getElementById(
    'register',
  ) as HTMLFormElement;

const restPort = 8080;
let userId: string | null = null;

registerButton.addEventListener('click', function (event) {
    event.preventDefault(); // prevent POSTback
    event.stopImmediatePropagation(); // prevent second coll from div
    //console.log(event);
  
    const action = `http://localhost:${restPort}/api/users/register`;
    //console.log(userInput);
    userId = null;
  
    fetch(action, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: '{}',
    })
      .then((response) => response.json())
      .then((response) => {
        const newUser: User = response;
        userId = newUser.userId;
        console.log(`user logged in ${userId}`);
        registerButton.classList.add('hidden');
        registerButton.style.display = "none"
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
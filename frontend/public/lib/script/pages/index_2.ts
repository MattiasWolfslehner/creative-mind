import '../../style/main.css';
import '../../style/style.scss';
import '../types';

import {IdeaList} from '../../components/idea-list';
import {RoomList} from '../../components/room-list';

import { localStorageAction } from '../actions/store';

const registerForm = document.getElementById('register-form') as HTMLFormElement;
const ideaForm = document.getElementById('idea-form') as HTMLFormElement;
const downloadCsvBtn = document.getElementById('download-csv') as HTMLAnchorElement;
const copyButton = document.getElementById('copy-uuid-button') as HTMLButtonElement;
const cmUuidElement = document.getElementById('cm-uuid') as HTMLElement;
const ideaList = document.getElementById("idea-list") as IdeaList;
const roomList = document.getElementById("room-list") as RoomList;

const restPort = 8080;
let uuid: string | null = null;
// let ideas: Idea[] = [];


roomList.addEventListener('room-joined'
    , async function (event) {
  const selectedUuid = (<CustomEvent>event).detail;
  console.log(selectedUuid);
  await localStorageAction.save('cm-uuid', selectedUuid);
  getIdeas();
    }
);

// register
registerForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const storedUuid: string | null = await localStorageAction.load('cm-uuid');
  if (storedUuid && storedUuid.length > 0) {
    updateUI();
    return;
  }

  const action = `http://localhost:${restPort}/api/ideas/register`;

  fetch(action, {
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => response.json())
    .then((response) => {
      const generatedUuid = response.uuid;

      localStorageAction.save('cm-uuid', generatedUuid);

      updateUI();
    });
});

function updateUI() {
  ideaForm.classList.toggle('hidden');
  registerForm.classList.toggle('hidden');
  console.log(localStorage.getItem('cm-uuid'));
  const cmUuid = localStorage.getItem('cm-uuid')?.replace(`"`, '').replace(`"`, '');

  copyButton.addEventListener('mouseenter', () => {
    if (cmUuidElement) {
      cmUuidElement.style.display = 'block';
      cmUuidElement.innerHTML = cmUuid || '';
    }
  });

  copyButton.addEventListener('mouseleave', () => {
    if (cmUuidElement) {
      cmUuidElement.style.display = 'none';
    }
  });

  /* copy uuid */
  copyButton.addEventListener('click', () => {
    if (cmUuid) {
      navigator.clipboard
        .writeText(cmUuid)
        .then(() => {
          alert('cm-uuid copied into clipboard!');
        })
        .catch((err) => {
          console.error('Something went wrong: ' + err);
        });
    }
  });
}

// add idea
ideaForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const action = `http://localhost:${restPort}/api/ideas/` + uuid;
  const formData = new FormData(event.target as HTMLFormElement);
  const content: string | null = formData.get('idea') as string | null;

  fetch(action, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({ content: content }),
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      getIdeas();
    })
    .catch((error) => {
      console.log(error);
    });
});

// fetch ideas
window.addEventListener('DOMContentLoaded', async function () {
  const storedUuid: string | null =  await localStorageAction.load('cm-uuid');

  if (storedUuid && storedUuid.length > 0) {
    updateUI();
  }

  getIdeas();
});

async function getIdeas() {
  uuid = await localStorageAction.load('cm-uuid');
  const action = `http://localhost:${restPort}/api/ideas/${uuid}/list`;

  fetch(action, {
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // ideas = data;
      ideaList.setIdeas(data);
      // let ideaRows = '';
      //
      // ideas.map((idea) => {
      //   ideaRows += `<tr>
      //   <td>
      //     ${idea.id}
      //   </td>
      //   <td>
      //     ${idea.content}
      //   </td>
      // </tr>`;
      // });
      //
      // const ideasTable = document.getElementById('ideas');
      // if (ideasTable) {
      //   ideasTable.innerHTML = ideaRows;
      // }
    })
    .catch((error) => {
      console.log(error);
    });
}

downloadCsvBtn.addEventListener('click', downloadFile);

async function downloadFile() {
  const uuid = await localStorageAction.load('cm-uuid');

  console.log(`UUID (button): ${uuid}`);

  const href = `http://localhost:${restPort}/api/ideas/${uuid}/download/csv`;
  const fileName = `ideas-${Date.now()}`;

  const response = await fetch(href);
  const blob = await response.blob();

  const suggestedFileName = prompt('Gib einen Dateinamen ein:', fileName);

  if (suggestedFileName) {
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = suggestedFileName + '.csv';
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}
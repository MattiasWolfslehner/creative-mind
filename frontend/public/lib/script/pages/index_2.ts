import '../../style/main.css';
import '../../style/style.scss';
import '../types';

import {IdeaList} from '../../components/idea-list';
import {RoomList} from '../../components/room-list';

import { localStorageAction } from '../actions/store';

const ideaForm2 = document.getElementById('idea-form2') as HTMLFormElement;
const downloadCsvBtn = document.getElementById('download-csv') as HTMLAnchorElement;
const copyButton = document.getElementById('copy-uuid-button') as HTMLButtonElement;
const cmUuidElement = document.getElementById('cm-uuid') as HTMLElement;
const ideaList2 = document.getElementById("idea-list2") as IdeaList;
const roomList = document.getElementById("room-list") as RoomList;

const restPort = 8080;
let uuid: string | null = null;
// let ideas: Idea[] = [];


roomList.addEventListener('room-joined'
    , async function (event) {
  const selectedUuid = (<CustomEvent>event).detail;
  console.log(selectedUuid);
  await localStorageAction.save('cm-uuid', selectedUuid);
  updateUI();
  getIdeas();
    }
);


function updateUI() {
  ideaForm2.classList.toggle('hidden');
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

}

// add idea
ideaForm2.addEventListener('submit', function (event) {
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
      //console.log(data);
      ideaList2.setIdeas(data);
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
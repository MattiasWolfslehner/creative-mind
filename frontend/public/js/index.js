import {localStorageAction} from './store.js';
const registerForm = document.getElementById('register-form');
const ideaForm = document.getElementById('idea-form');
const downloadCsvBtn = document.getElementById('download-csv')
const restPort = 8080;
let uuid = null;
let ideas = [];

// register
registerForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const uuid = await localStorageAction.load('cm-uuid');
  if (uuid && uuid.length > 0) {
    updateUI();
    return;
  }

  const action = `http://localhost:${restPort}/api/ideas/register`;

  fetch(action, {
    headers: {
      Accept: 'application/json',
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      const uuid = response.uuid;

      localStorageAction.save('cm-uuid', uuid);

      updateUI();
    });
});

function updateUI() {
  ideaForm.classList.toggle('hidden');
  registerForm.classList.toggle('hidden');

  /* copy uuid */
  document.getElementById("copy-uuid-button").addEventListener("click", () =>{
    var cmUuid = localStorage.getItem("cm-uuid").replace(`"`, ``).replace(`"`,``)

    if (cmUuid) {
      navigator.clipboard.writeText(cmUuid)
      .then(() => {
        alert("cm-uuid copied into clipboard!")
      })
      .catch((err) => {
        console.error("Something went wrongl: " + err)
      })
    }
  })

  // sets csv-download-link
  setDownloadButton()
}

// add idea
ideaForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const action = `http://localhost:${restPort}/api/ideas/` + uuid;
  const formData = new FormData(event.target);
  const content = formData.get('idea');

  fetch(action, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({content: content}),
  })
    .then((response) => {
      return response.json();
    })
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
  const uuid = await localStorageAction.load('cm-uuid');

  if (uuid && uuid.length > 0) {
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
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      ideas = data;
      let ideaRows = '';

      ideas.forEach((idea) => {
        ideaRows += `<tr>
        <td>
          ${idea.id}
        </td>
        <td>
          ${idea.content}
        </td>
      </tr>`;
      });

      document.getElementById('ideas').innerHTML = ideaRows;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function setDownloadButton(){
  uuid = await localStorageAction.load('cm-uuid');

  console.log(`UUID (button): ${uuid}`);

  const href = `http://localhost:${restPort}/api/ideas/${uuid}/download/csv`;
  const fileName = `${Date.now()}.csv`

  downloadCsvBtn.href = href
  downloadCsvBtn.download = fileName
}


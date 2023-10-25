
createRoom.addEventListener('sendButton', ()=> {
    const newIdea = document.getElementById('ideaInput').value;
    //fetch: send data to route

    fetch('http://localhost:8080/api/idea/',{
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          method: "POST",
          body: JSON.stringify({text: newIdea})
    })
    .then((response) => {
        return response.json()
    })
    //write Ideas to list
    .then((data)=>{
        console.log(data);
    })
    .catch((err)=>{
        console.log(err);
    })

})


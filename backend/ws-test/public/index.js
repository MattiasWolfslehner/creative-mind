let socket; // Declare the socket variable without initializing it

const connectToSocket = document.getElementById('connectToSocket');
const roomId = document.getElementById('roomId');
const userId = document.getElementById('userId');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messageDisplay = document.getElementById('messageDisplay');

connectToSocket.addEventListener('click', () => {
    let id = roomId.value;
    let userid = userId.value;

    // Create a new WebSocket connection
    socket = new WebSocket(`ws://localhost:8080/rooms/join/${id}/${userid}`);

    socket.onopen = function (event) {
        console.log("WebSocket connection opened:", event);

        // Assuming userData is the object you want to send
        const userData = {
            username: "your-username", // replace with the actual username
            otherData: "some-other-data",
        };

        // Send the user data as an initialization message
        socket.send(JSON.stringify(userData));
    };

    socket.onmessage = function (event) {
        const message = JSON.parse(event.data);
        handleWebSocketMessage(message);
    };

    socket.onclose = function (event) {
        console.log("WebSocket connection closed:", event);
    };

    socket.onerror = function (error) {
        console.error("WebSocket error:", error);
    };
});

// Function to close the WebSocket connection
function closeWebSocketConnection() {
    if (socket) {
        socket.close(1000, "Closed by the client");
    }
}

const btn = document.getElementById('close');

btn.addEventListener('click', () => {
    closeWebSocketConnection();
});



// Event handler for incoming messages
function handleWebSocketMessage(message) {
    console.log("Received message:", message);

    // Display the received message in the UI
    messageDisplay.innerHTML += `<p>${message}: ${message}</p>`;
}


// Event listener for the send button
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message !== '') {
        sendMessageToServer(message);

        // Clear the input field after sending the message
        messageInput.value = '';
    }
});


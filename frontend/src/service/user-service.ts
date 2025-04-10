// Imports
import { produce } from "immer" // For immutably updating the state
import { User, store } from "../model" // Importing User model and store object
import path from "./service-const" // Importing the base path for API endpoints
import RoomManagerSocketService from "../components/panel/room-manager-socket-service"; // Service for user-facing messages

class UserService {

    // Function to fetch all users
    async getUsers() {
        // Creating headers for the request, including Authorization token from localStorage
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token") // Bearer token for authentication
        });

        // Sending a GET request to fetch the list of users from the server
        const response = await fetch(`${path}/api/users/list`, {
            headers: theHeader // Sending headers with the request
        });

        // Checking if the response is successful (status 200)
        if (response.ok) {
            // If the request is successful, parsing the response body into a list of users
            const users: User[] = await response.json();

            // Updating the store with the fetched list of users using Immer for immutability
            const model = produce(store.getValue(), draft => {
                draft.users = users; // Setting the users array in the draft state
            })

            // Pushing the updated state into the store
            store.next(model);
        }
        else {
            // If there is an error in the response, pushing an error message through RoomManagerSocketService
            RoomManagerSocketService.pushOneMessage("Could not connect to Server (Users)!")
        }
    }

    // Function to fetch all users from a specific room using the roomId
    async getUsersFromRoom(roomId: string): Promise<User[]> {
        // Creating headers for the request, including Authorization token from localStorage
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token") // Bearer token for authentication
        });

        // Sending a GET request to fetch the list of users from a specific room
        const response = await fetch(`${path}/api/users/list/${roomId}`, { headers: theHeader });

        // If the response is not successful, push an error message and log the error
        if (!response.ok) {
            RoomManagerSocketService.pushOneMessage("Could not connect to Server (Users)!")
            console.error("Error fetching users:", response.statusText); // Logging error in the console
            return []; // Return an empty array if there was an error
        }

        // Parsing the response body into a list of users from the specific room
        const users: User[] = await response.json();

        // Returning the list of users from the specific room
        return users;
    }
}

// Creating an instance of UserService
const userService = new UserService()

// Exporting an instance of the service to be used in other parts of the application
export default userService

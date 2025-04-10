// Imports
import { produce } from "immer"; // For immutably updating the state
import { store } from "../model"; // Central state management
import path from "./service-const"; // API base path
import { Participation } from "../model/participation"; // Participation model
import RoomManagerSocketService from "../components/panel/room-manager-socket-service"; // Service for user-facing messages

class ParticipationService {

    /**
     * Fetches all participants (participations) of a specific room
     * and updates the application store with the result.
     * If no roomId is provided, the currently active room is used.
     */
    async getParticipantsInRoom(roomId: string | null) {
        // Use the activeRoomId from the store if no roomId is passed
        if (!roomId) {
            const model = store.getValue();
            roomId = model.activeRoomId;
        }

        // If still no roomId, exit early (e.g., not in a room yet)
        if (!roomId) {
            console.log("not in room yet!");
            return;
        }

        // Prepare request headers with authentication token
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });

        // Send request to fetch participations for the given room
        const response = await fetch(`${path}/api/participations/room/${roomId}`, {
            headers: theHeader
        });

        try {
            if (response.ok) {
                // Parse and store the participations
                const participations: Participation[] = await response.json();

                // Update the store with the new list of participations
                const model = produce(store.getValue(), draft => {
                    draft.participations = participations;
                });

                store.next(model);
            } else {
                // Notify the user that the server couldn't be reached
                RoomManagerSocketService.pushOneMessage("Could not connect to Server (Participants)!");
            }
        } catch (error) {
            // Catch and log any unexpected errors during the fetch
            console.log(error);
        }
    }
}

// Export an instance of the service to be used in other parts of the application
const participationService = new ParticipationService();
export default participationService;

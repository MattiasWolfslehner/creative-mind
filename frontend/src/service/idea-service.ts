// Imports
import { produce } from "immer"; // For immutably updating the state
import { Idea, store } from "../model"; // Shared state and data types
import path from "./service-const"; // API base path
import RoomManagerSocketService from "../components/panel/room-manager-socket-service"; // Service for user-facing messages

class IdeaService {
    /**
     * Fetch all ideas for a given room from the backend,
     * assign the roomId (not included in API response),
     * and update the store.
     */
    async getIdeasByRoomId(roomId: string) {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });

        const response = await fetch(`${path}/api/ideas/${roomId}`, {
            headers: theHeader
        });

        try {
            if (response.ok) {
                const ideas: Idea[] = await response.json();

                // Since the API response doesn't include roomId, set it manually
                ideas.forEach((idea) => idea.roomId = roomId);

                // Update the global store with the fetched ideas
                const model = produce(store.getValue(), draft => {
                    draft.ideas = ideas;
                });

                store.next(model);
            } else {
                RoomManagerSocketService.pushOneMessage("Could not connect to Server (Ideas)!");
            }
        } catch (error) {
            console.error('Error fetching ideas:', error);
        }
    }


    // Post a new idea to the server and update the store upon success.
    async postNewIdea(idea: Idea) {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });

        try {
            const response = await fetch(`${path}/api/ideas`, {
                method: 'POST',
                headers: theHeader,
                body: JSON.stringify(idea)
            });

            if (response.ok) {
                const responseData = await response.json();
                // console.log("Idea successfully added:", responseData);

                // Add new idea to store optimistically
                const model = produce(store.getValue(), draft => {
                    draft.ideas.push(idea);
                });

                store.next(model);
            } else {
                RoomManagerSocketService.pushOneMessage("Could not send to Server (Ideas)!");
            }
        } catch (error) {
            console.error('Error posting idea:', error);
        }
    }
}

// Export an instance of the service to be used in other parts of the application
const ideaService = new IdeaService();
export default ideaService;

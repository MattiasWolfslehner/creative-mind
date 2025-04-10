// Imports
import { produce } from "immer"; // For immutably updating the state
import { MBParameter, store } from "../model"; // Model and shared state
import path from "./service-const"; // API base path
import { MBCombination } from "../model/mbcombination"; // Model for combinations
import RoomManagerSocketService from "../components/panel/room-manager-socket-service"; // Service for user-facing messages

class MorphoService {
    /**
     * Fetch all morphological parameters for a given room
     * and update the store with the result.
     */
    async getParameterForRoom(roomId: string) {
        if (!roomId) return null;

        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });

        const response = await fetch(`${path}/api/morpho/${roomId}/parameter`, {
            headers: theHeader
        });

        try {
            if (response.ok) {
                const parameters: MBParameter[] = await response.json();

                // Update store with received parameters
                const model = produce(store.getValue(), draft => {
                    draft.parameters = parameters;
                });

                store.next(model);
            } else {
                RoomManagerSocketService.pushOneMessage("Could not connect to Server (Parameters)!");
            }
        } catch (error) {
            console.log(`error in getParameterForRoom for ${roomId}`);
            console.log(error);
            return null;
        }
    }

    /**
     * Fetch all morphological combinations for a given room
     * and update the store with the result.
     */
    async getCombinationsForRoom(roomId: string) {
        if (!roomId) return null;

        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });

        const response = await fetch(`${path}/api/morpho/${roomId}/combination`, {
            headers: theHeader
        });

        try {
            if (response.ok) {
                const combinations: MBCombination[] = await response.json();

                // Update store with received combinations
                const model = produce(store.getValue(), draft => {
                    draft.combinations = combinations;
                });

                store.next(model);
            } else {
                RoomManagerSocketService.pushOneMessage("Could not connect to Server (Combinations)!");
            }
        } catch (error) {
            console.log(`error in getCombinationsForRoom for ${roomId}`);
            console.log(error);
            return null;
        }
    }

    /**
     * Save a realization (content option) under a given parameter.
     * Handles both creation and updating depending on presence of contentId.
     */
    async saveRealization(paramId: number, content: string, contentId: number | null = null) {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });

        const tempJson = JSON.stringify({
            'paramId': paramId,
            'content': content
        });

        let response;

        // Update existing realization if ID is given, otherwise create new
        if (contentId) {
            response = await fetch(`${path}/api/morpho/realization/${contentId}`, {
                method: 'PUT',
                headers: theHeader,
                body: tempJson
            });
        } else {
            response = await fetch(`${path}/api/morpho/realization`, {
                method: 'POST',
                headers: theHeader,
                body: tempJson
            });
        }

        try {
            if (response.ok) {
                console.log('Realization successfully sent to backend.');
            } else {
                RoomManagerSocketService.pushOneMessage("Could not save Realization to Server!");
            }
        } catch (error) {
            console.error('Error while sending realization to backend:', error);
        }
    }

    /**
     * Save a parameter (dimension of variation) for a room.
     * Can either create a new parameter or update an existing one.
     */
    async saveParameter(title: string, roomId: string, paramId: number | null = null) {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });

        const tempJson = JSON.stringify({
            'title': title,
            'roomId': roomId
        });

        let response;

        // PUT if updating an existing parameter, POST if creating new
        if (paramId) {
            response = await fetch(`${path}/api/morpho/parameter/${paramId}`, {
                method: 'PUT',
                headers: theHeader,
                body: tempJson
            });
        } else {
            response = await fetch(`${path}/api/morpho/parameter`, {
                method: 'POST',
                headers: theHeader,
                body: tempJson
            });
        }

        try {
            if (response.ok) {
                console.log('Parameter successfully sent to backend.');
            } else {
                RoomManagerSocketService.pushOneMessage("Could not save Parameter to Server!");
            }
        } catch (error) {
            console.error('Error while sending parameter to backend:', error);
        }
    }

    /**
     * Save a morphological combination (selected option across all parameters)
     * for a specific room and user.
     */
    async saveCombination(roomId: string, memberId: string, combination: string) {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });

        const tempJson = JSON.stringify({
            'morphologicalRoomId': roomId,
            'memberId': memberId,
            'combinationText': combination
        });

        const response = await fetch(`${path}/api/morpho/combination`, {
            method: 'POST',
            headers: theHeader,
            body: tempJson
        });

        try {
            if (response.ok) {
                console.log('Combination successfully sent to backend.');
            } else {
                RoomManagerSocketService.pushOneMessage("Could not save Combination at Server!");
            }
        } catch (error) {
            console.error('Error while sending combination to backend:', error);
        }
    }
}

// Export an instance of the service to be used in other parts of the application
const morphoService = new MorphoService();
export default morphoService;

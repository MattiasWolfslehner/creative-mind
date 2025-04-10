// Imports
import { produce } from "immer"; // For immutably updating the state
import { Room, store } from "../model"; // Room type and centralized store
import path from "./service-const"; // API path configuration
import "./morpho-service"; // Import for side-effects (if any)
import morphoService from "./morpho-service"; // Service for morphological operations
import RoomManagerSocketService from "../components/panel/room-manager-socket-service"; // Service for user-facing messages

class RoomService {

    /**
     * Fetch all rooms from the backend.
     * Since room type is not included in this endpoint, each room is fetched individually for full details.
     */
    async getRooms() {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });

        const response = await fetch(`${path}/api/rooms/list`, {
            headers: theHeader
        });

        if (response.ok) {
            const rooms: Room[] = await response.json();

            // Instead of storing immediately, we fetch each room individually to ensure complete room info
            rooms.forEach((aRoom) => {
                this.getRoom(aRoom.roomId); // Fetches complete room info including the 'type' field
            });
        } else {
            RoomManagerSocketService.pushOneMessage("Could not connect to Server (Rooms)!");
        }
    }


    // Create a new room and store it. If it's a morphological room, add dummy parameters and realizations.
    async createRoom(roomType: string, roomName: string, description: string | null): Promise<Room> {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });

        const response = await fetch(`${path}/api/rooms/create`, {
            method: 'POST',
            headers: theHeader,
            body: JSON.stringify({ type: roomType, name: roomName, description })
        });

        if (response.ok) {
            const room: Room = await response.json();

            // Add the new room to the store
            const model = produce(store.getValue(), draft => {
                draft.rooms.push(room);
            });
            store.next(model);
            console.log(room);

            // If the room is of type 'morphologicalroom', add dummy parameters and realizations
            if (roomType === 'morphologicalroom') {
                this.saveDummyParameters(room.roomId);
            }

            return room;
        } else {
            RoomManagerSocketService.pushOneMessage("Could not connect to Server (Rooms)!");
        }

        return null;
    }


    // Add dummy parameters and realizations to a morphological room.
    async saveDummyParameters(roomId: string) {
        const dummyParameters = ['Farbe', 'Textur'];

        // Save each dummy parameter
        for (let i = 0; i < dummyParameters.length; i++) {
            await morphoService.saveParameter(roomId, dummyParameters[i]);
        }

        // Retrieve updated parameters from the store
        const parameters = store.getValue().parameters;

        const dummyRealizationContent = ['Rot', 'Rau', 'Rau2', 'Rau3'];

        if (dummyRealizationContent.length > parameters.length) {
            console.warn('More realizations than parameters. Realizations will be truncated.');
        }

        // Save realizations for each parameter
        await Promise.all(parameters.map(async (parameter, index) => {
            for (let i = 0; i < 3; i++) {
                const realization = await morphoService.saveRealization(parameter.paramId, `Content${index} | ${i}`);
                console.log('new Realization: ', realization);
            }
        }));

        console.log(store.getValue().parameters); // Debug log
    }


    // Update the state (status) of a room.
    async updateState(roomId: string, roomState: string) {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });

        const response = await fetch(`${path}/api/rooms/updateState/${roomId}`, {
            method: 'PUT',
            headers: theHeader,
            body: JSON.stringify({ roomState })
        });

        if (response.ok) {
            const room: boolean = await response.json();
            console.log(`Room state changed: ${room}`);
            return room;
        } else {
            RoomManagerSocketService.pushOneMessage("Could not connect to Server (Rooms)!");
        }

        return false;
    }


    // Update room details such as name and description.
    async updateRoom(room: Room) {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });

        const response = await fetch(`${path}/api/rooms/update/${room.roomId}`, {
            method: 'PUT',
            headers: theHeader,
            body: JSON.stringify({
                name: room.name,
                description: room.description
            })
        });

        if (response.ok) {
            const updated_room: Room = await response.json();

            // Replace the old room with the updated version in the store
            const model = produce(store.getValue(), draft => {
                draft.rooms = draft.rooms.filter(r => r.roomId !== room.roomId);
                draft.rooms.push(updated_room);
            });
            store.next(model);

            console.log(updated_room);
            return updated_room;
        } else {
            RoomManagerSocketService.pushOneMessage("Could not connect to Server (Rooms)!");
        }

        return null;
    }


    // Start a room (change its active state).
    async startRoom(roomId: string) {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });

        const response = await fetch(`${path}/api/rooms/start/${roomId}`, {
            method: 'PUT',
            headers: theHeader
        });

        if (!response.ok) {
            RoomManagerSocketService.pushOneMessage("Could not connect to Server (Rooms)!");
        }

        // Optionally refetch room state after starting
        const x = this.getRoom(roomId);
        return x !== null;
    }

    // Stop a room (end its activity).
    async stopRoom(roomId: string) {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });

        const response = await fetch(`${path}/api/rooms/stop/${roomId}`, {
            method: 'PUT',
            headers: theHeader
        });

        if (!response.ok) {
            RoomManagerSocketService.pushOneMessage("Could not connect to Server (Rooms)!");
        }

        // Optionally refetch room state after stopping
        const x = this.getRoom(roomId);
        return x !== null;
    }


    // Fetch full data for a specific room and update the store.
    async getRoom(roomId: string | null): Promise<Room> {
        // Use active room ID from the store if no roomId is provided
        if (!roomId) {
            const model = store.getValue();
            roomId = model.activeRoomId;
        }

        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });

        const response = await fetch(`${path}/api/rooms/get/${roomId}`, {
            method: 'GET',
            headers: theHeader
        });

        try {
            if (response.ok) {
                const room: Room = await response.json();

                // Replace old room data with the new one
                const model = produce(store.getValue(), draft => {
                    draft.rooms = draft.rooms.filter(r => r.roomId !== roomId);
                    draft.rooms.push(room);
                });
                store.next(model);

                return room;
            } else {
                if (response.status === 404) {
                    console.log("room not found! 404!");
                    RoomManagerSocketService.pushOneMessage("Room not found!");
                }
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}

// Export an instance of the service to be used in other parts of the application
const roomService = new RoomService();
export default roomService;

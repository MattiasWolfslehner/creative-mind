import { produce } from "immer"
import { Room, store } from "../model"
import path from "./service-const"
import "./morpho-service"
import morphoService from "./morpho-service";
import RoomManagerSocketService from "../components/panel/room-manager-socket-service";

class RoomService {


    async getRooms() {
        //fetch
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/rooms/list`, {
            headers: theHeader
        });

        if (response.ok) {
            const rooms: Room[] = await response.json();
            //console.log(rooms);

            /* LIST GIVES NO type value => call indiv get
            const model = produce(store.getValue(), draft => {
                draft.rooms = rooms;
            });

            store.next(model);
            */

            rooms.forEach((aRoom) => {
                this.getRoom(aRoom.roomId); // force fetch type!
            });
        }
        else {
            RoomManagerSocketService.pushOneMessage("Could not connect to Server (Rooms)!")
        }

    }

    async createRoom(roomType: string, roomName: string, description: string | null): Promise<Room> {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/rooms/create`, {
            method: 'POST',
            headers: theHeader,
            body: JSON.stringify({
                'type': roomType,
                'name': roomName,
                'description': description
            })
        });

        if (response.ok) {
            const room: Room = await response.json();

            //add room to store
            const model = produce(store.getValue(), draft => {
                draft.rooms.push(room);
            })
            store.next(model);
            console.log(room);

            if (roomType == 'morphologicalroom') {
                this.saveDummyParameters(room.roomId);
            }
            return room;
        }
        else {
            RoomManagerSocketService.pushOneMessage("Could not connect to Server (Rooms)!")
        }

        return null;
    }

    async saveDummyParameters(roomId: string) {
        // Insert dummy Parameters
        const dummyParameters = ['Farbe', 'Textur'];

        // Create parameters and wait for them to be added to the store
        for (let i = 0; i < dummyParameters.length; i++) {
            await morphoService.saveParameter(roomId, dummyParameters[i]);
        }

        // Fetch updated parameters from the store after creation
        const parameters = store.getValue().parameters;

        // Insert dummy Realizations for each corresponding parameter
        const dummyRealizationContent = ['Rot', 'Rau', 'Rau2', 'Rau3'];

        // Check if the number of realizations exceeds the number of parameters
        if (dummyRealizationContent.length > parameters.length) {
            console.warn('More realizations than parameters. Realizations will be truncated.');
        }

        // Use Promise.all to ensure all async operations are completed before moving forward
        await Promise.all(parameters.map(async (parameter, index) => {
            for (let i = 0; i < 3; i++) {
                const realization = await morphoService.saveRealization(parameter.paramId, `Content${ index } | ${ i }`);
                console.log('new Realization: ', realization);
            }
        }));

        // This will now be executed after all realizations have been created
        console.log(store.getValue().parameters);
    }

    async updateState(roomId: string, roomState: string) {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/rooms/updateState/${roomId}`, {
            method: 'PUT',
            headers: theHeader,
            body: JSON.stringify({ roomState: roomState })
        });

        if (response.ok) {
            const room: boolean = await response.json();
            console.log(`Room state changed: ${room}`);
            return room;
        }
        else {
            RoomManagerSocketService.pushOneMessage("Could not connect to Server (Rooms)!")
        }

        return false;
    }

    async updateRoom(room: Room) {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/rooms/update/${room.roomId}`, {
            method: 'PUT',
            headers: theHeader,
            body: JSON.stringify({ name: room.name, description: room.description })
        });

        if (response.ok) {
            const updated_room: Room = await response.json();

            //remove old room and add new room to store
            const model = produce(store.getValue(), draft => {
                draft.rooms = draft.rooms.filter(r => r.roomId !== room.roomId);
                draft.rooms.push(updated_room);
            })
            store.next(model);
            console.log(updated_room);
            return updated_room;
        }
        else {
            RoomManagerSocketService.pushOneMessage("Could not connect to Server (Rooms)!")
        }

        return null;
    }

    async startRoom(roomId: string) {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/rooms/start/${roomId}`, {
            method: 'PUT',
            headers: theHeader
        });

        if (response.ok) {
            const room: boolean = await response.json();
        }
        else {
            RoomManagerSocketService.pushOneMessage("Could not connect to Server (Rooms)!")
        }
        //console.log(`Room started: ${room}`);
        // fetch new status
        const x = this.getRoom(roomId);
        return x!==null;
    }

    async stopRoom(roomId: string) {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/rooms/stop/${roomId}`, {
            method: 'PUT',
            headers: theHeader
        });

        if (response.ok) {
            const room: boolean = await response.json();

            //console.log(`Room stopped: ${room}`);
            // fetch new status
        }
        else {
            RoomManagerSocketService.pushOneMessage("Could not connect to Server (Rooms)!")
        }

        const x = this.getRoom(roomId);
        return x!==null;
    }


    async getRoom(roomId: string | null): Promise<Room> {
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
                // no 404 when no row found !?
                const room: Room = await response.json();

                //add room to store
                const model = produce(store.getValue(), draft => {
                    // delete if there
                    draft.rooms = draft.rooms.filter(r => r.roomId !== roomId);
                    // push new version
                    draft.rooms.push(room);
                })

                store.next(model);

                return room;
            } else {
                if (response.status === 404) {
                    console.log("room not found! 404!")
                    RoomManagerSocketService.pushOneMessage("Room not found!")
                }
                return null;
            }
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
}


const roomService = new RoomService();
export default roomService;
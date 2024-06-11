import { produce } from "immer"
import { Room, store } from "../model"
import path from "./service-const"



class RoomService {
    

    async getRooms(){
        //fetch
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/rooms/list`, {
            headers: theHeader
        });
        const rooms : Room[] = await response.json();
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

    async createRoom(roomType : string, roomName: string, description: string|null) : Promise<Room> {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/rooms/create`,{
            method: 'POST',
            headers: theHeader,
            body: JSON.stringify({
                'type': roomType,
                'name': roomName,
                'description': description
            })
        });

        const room : Room = await response.json();


        //add room to store
        const model = produce(store.getValue(), draft => {
            draft.rooms.push(room);
        })
        store.next(model);
        console.log(room);
        return room;
    }

    async updateState(roomId : string, roomState: string)  {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/rooms/updateState/${roomId}`,{
            method: 'PUT',
            headers: theHeader,
            body: JSON.stringify({roomState: roomState})
        });

        const room : boolean = await response.json();

        console.log(`Room state changed: ${room}`);

        return room;
    }

    async updateRoom(room: Room)  {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/rooms/update/${room.roomId}`,{
            method: 'PUT',
            headers: theHeader,
            body: JSON.stringify({name: room.name, description: room.description})
        });

        const updated_room : Room = await response.json();

        //remove old room and add new room to store
        const model = produce(store.getValue(), draft => {
            draft.rooms = draft.rooms.filter(r => r.roomId !== room.roomId);
            draft.rooms.push(updated_room);
        })
        store.next(model);
        console.log(updated_room);
        return updated_room;
    }

    async startRoom(roomId : string)  {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/rooms/start/${roomId}`,{
            method: 'PUT',
            headers: theHeader
        });

        const room : boolean = await response.json();

        //console.log(`Room started: ${room}`);
        // fetch new status
        const x = this.getRoom(roomId);

        return room;
    }

    async stopRoom(roomId : string)  {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/rooms/stop/${roomId}`,{
            method: 'PUT',
            headers: theHeader
        });

        const room : boolean = await response.json();

        //console.log(`Room stopped: ${room}`);
        // fetch new status
        const x = this.getRoom(roomId);

        return room;
    }


    async getRoom(roomId : string | null) : Promise<Room> {
        if (!roomId) {
            const model = store.getValue();
            roomId  = model.activeRoomId;
        }
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/rooms/get/${roomId}`, {
            method: 'GET',
            headers: theHeader
        });

        // TODO: either must catch empty response here or ?!
        // no 404 when no row found !?
        const room : Room = await response.json();

        //add room to store
        const model = produce(store.getValue(), draft => {
            let isPresent:boolean = false;
            draft.rooms.forEach( (aRoom) => {
                if (aRoom.roomId === roomId) {
                    isPresent = true;
                    aRoom.type = room.type;
                    aRoom.roomState = room.roomState;
                }
            });
            if (!isPresent) {
                draft.rooms.push(room);
            }
        })

        store.next(model);

        return room;
    }
}


const roomService = new RoomService();
export default roomService;
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

    async createRoom(roomType : string) : Promise<Room> {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/rooms/create`,{
            method: 'POST',
            headers: theHeader,
            body: JSON.stringify({
                'type': roomType
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

        console.log(`Room started: ${room}`);

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

        console.log(`Room stopped: ${room}`);

        return room;
    }


    async getRoom(roomId : string) : Promise<Room> {
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
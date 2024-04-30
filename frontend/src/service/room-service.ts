import { produce } from "immer"
import { Room, store } from "../model"

const path:string= 'http://localhost:8080';

class RoomService {
    

    async getRooms(){
        //fetch
        const response = await fetch(`${path}/api/rooms/list`)
        const rooms : Room[] = await response.json()
        console.log(rooms)

        const model = produce(store.getValue(), draft => {
            draft.rooms = rooms
        })

        store.next(model);

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
        })

        const room : Room = await response.json();


        //add room to store
        const model = produce(store.getValue(), draft => {
            draft.rooms.push(room);
        })
        console.log(room);
        
        return room;
    }
}


const roomService = new RoomService()
export default roomService
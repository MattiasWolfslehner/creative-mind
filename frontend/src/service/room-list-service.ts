import { produce } from "immer"
import { Room, store } from "../model"

class RoomService {

    async getRooms(){
        //fetch
        const response = await fetch(`http://localhost:8080/api/rooms/list`)
        const rooms : Room[] = await response.json()
        console.log(rooms)

        const model = produce(store.getValue(), draft => {
            draft.rooms = rooms
        })

        store.next(model);

    }
}


const roomService = new RoomService()
export default roomService
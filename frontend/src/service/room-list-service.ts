import {Room} from '../model'

class RoomService {

    async getAllRooms() {
        const response = await fetch('localhost:8080/api/rooms/list')
        const rooms: Room[] = await response.json()
        console.log(rooms)
    }
}

const roomService = new RoomService()
export default roomService
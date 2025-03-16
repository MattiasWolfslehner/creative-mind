import { produce } from "immer"
import { User, store } from "../model"
import path from "./service-const"
import RoomManagerSocketService from "../components/panel/room-manager-socket-service";

class UserService {

    async getUsers(){
        //fetch
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/users/list`, {
            headers: theHeader
        });
        if (response.ok) {
            const users: User[] = await response.json();
            //console.log(users);

            const model = produce(store.getValue(), draft => {
                draft.users = users;
            })

            store.next(model);
        }
        else {
            RoomManagerSocketService.pushOneMessage("Could not connect to Server (Users)!")
        }

    }

        async getUsersFromRoom(roomId: string): Promise<User[]> {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });

        const response = await fetch(`${path}/api/users/list/${roomId}`, { headers: theHeader });

        if (!response.ok) {
            RoomManagerSocketService.pushOneMessage("Could not connect to Server (Users)!")
            console.error("Error fetching users:", response.statusText);
            return [];
        }

        const users: User[] = await response.json();
        return users;
    }

}


const userService = new UserService()
export default userService

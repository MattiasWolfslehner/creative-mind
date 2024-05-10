import { produce } from "immer"
import { User, store } from "../model"
import path from "./service-const"

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
        const users : User[] = await response.json();
        //console.log(users);

        const model = produce(store.getValue(), draft => {
            draft.users = users;
        })

        store.next(model);

    }
}


const userService = new UserService()
export default userService
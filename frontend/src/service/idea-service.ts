import { produce } from "immer"
import { Idea, store } from "../model"
import path from "./service-const"
import RoomManagerSocketService from "../components/panel/room-manager-socket-service";

class IdeaService{

    async getIdeasByRoomId(roomId : string){
        //fetch
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/ideas/${roomId}`, {
            headers: theHeader
        });
        try {
            if (response.ok) {
                const ideas: Idea[] = await response.json();

                //set roomid as it does not come with the API
                ideas.forEach((idea) => idea.roomId = roomId);

                const model = produce(store.getValue(), draft => {
                    draft.ideas = ideas;
                })

                store.next(model);
            }
            else {
                RoomManagerSocketService.pushOneMessage("Could not connect to Server (Ideas)!");
            }
        }
        catch (error) {
            console.log(error);
        }

    }
    
    async postNewIdea(idea : Idea){
        try{
            const theHeader = new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem("token")
            });
            //fetch

            const response = await fetch(`${path}/api/ideas`,{
                method: 'POST',
                headers: theHeader,
                body: JSON.stringify(idea)
            });

            if(response.ok){
                const responseData = await response.json();
                //console.log("idea has been added successfully: ", responseData);
            
                //add idea to store
                const model = produce(store.getValue(), draft => {
                    draft.ideas.push(idea);
                });
                store.next(model);

            }
            else {
                RoomManagerSocketService.pushOneMessage("Could not send to Server (Ideas)!");
            }

        } catch(error) {
            console.error('Error posting idea: ', error);
        }
    }
}


const ideaService = new IdeaService();
export default ideaService;
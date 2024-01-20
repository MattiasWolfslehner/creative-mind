import { produce } from "immer"
import { Idea, store } from "../model"

class IdeaService{

    async getIdeasByRoomId(roomId){
        //fetch
        const response = await fetch(`http://localhost:8080/api/ideas/${roomId}`)
        const ideas : Idea[] = await response.json()
        console.log(ideas)

        const model = produce(store.getValue(), draft => {
            draft.ideas = ideas
        })

        store.next(model);

    }
    
    async postNewIdea(roomId, memberId){
        //fetch
    }
}


const ideaService = new IdeaService()
export default ideaService
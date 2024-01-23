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
    
    async postNewIdea(idea : Idea){
        try{
        //fetch
        const response = await fetch('http://localhost:8080/api/ideas',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(idea)
        });

        if(response.ok){
            const responseData = await response.json()
            console.log("idea has been added successfully: ", responseData);
            
            //add idea to store
            const model = produce(store.getValue(), draft => {
                draft.ideas.push(idea);
            })

            store.next(model);

        }else{
            console.error('Error posting idea: ', response.statusText);
        }
        }catch(error){
            console.error('Error posting idea: ', error);
            
        }
    }
}


const ideaService = new IdeaService()
export default ideaService
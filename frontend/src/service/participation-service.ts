import { produce } from "immer"
import { store } from "../model"
import {Participation} from "../model/participation";

class ParticipationService {

    async getParticipantsInRoom(roomId:string | null){
        if (!roomId) {
            const model = store.getValue();
            roomId  = model.activeRoomId;
        }
        if (!roomId) {
            //console.log("not in room yet!");
            return;
        }
        //fetch
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+ localStorage.getItem("token")
        });
        const response = await fetch(`api/participations/room/${roomId}`, {
            headers: theHeader
        });

        try {
            const participations: Participation[] = await response.json();
            //console.log(participations);

            const model = produce(store.getValue(), draft => {
                draft.participations = participations;
            })

            store.next(model);
        } catch (error) {
            console.log(error);
        }
    }
}


const participationService = new ParticipationService()
export default participationService
import { produce } from "immer"
import { store } from "../model"
import path from "./service-const"
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
        const response = await fetch(`${path}/api/participations/room/${roomId}`, {
            headers: theHeader
        });
        const participations : Participation[] = await response.json();
        console.log(participations);

        const model = produce(store.getValue(), draft => {
            draft.participations = participations;
        })

        store.next(model);
    }
}


const participationService = new ParticipationService()
export default participationService
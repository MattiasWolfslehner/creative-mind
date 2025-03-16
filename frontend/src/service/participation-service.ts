import { produce } from "immer"
import { store } from "../model"
import path from "./service-const"
import {Participation} from "../model/participation";
import RoomManagerSocketService from "../components/panel/room-manager-socket-service";

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

        try {
            if (response.ok) {
                const participations: Participation[] = await response.json();
                //console.log(participations);

                const model = produce(store.getValue(), draft => {
                    draft.participations = participations;
                })

                store.next(model);
            }
            else {
                RoomManagerSocketService.pushOneMessage("Could not connect to Server (Participants)!");
            }

        } catch (error) {
            console.log(error);
        }
    }
}


const participationService = new ParticipationService()
export default participationService
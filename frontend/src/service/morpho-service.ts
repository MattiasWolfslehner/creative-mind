import { produce } from "immer"
import { MBParameter, store } from "../model"
import path from "./service-const"

class MorphoService {

    async getParameterForRoom(roomId: string) {
        //fetch
        if (!roomId) return null;

        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/morpho/${roomId}/parameter`, {
            headers: theHeader
        });
        try {
            const parameters: MBParameter[] = await response.json();
            console.log("parameters here");
            console.log(parameters);

            const model = produce(store.getValue(), draft => {
                draft.parameters = parameters;
            });

            store.next(model);
        }
        catch (error) {
            console.log(`error in getParameterForRoom for ${roomId}`);
            console.log(error);
            return null;
        }

    }

    async createParameterForRoom(roomId: string, title: string): Promise<MBParameter> {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/morpho/parameter`, {
            method: 'POST',
            headers: theHeader,
            body: JSON.stringify({
                'roomId': roomId,
                'title': title
            })
        });
        try {
            const parameter: MBParameter = await response.json();

            //add room to store
            const model = produce(store.getValue(), draft => {
                draft.parameters.push(parameter);
            })
            store.next(model);
            console.log(parameter);
            return parameter;
        }
        catch (error) {
            console.log(`Error in createParameterForRoom ${error}`);
            return null;
        }
    }

    async saveCombination(roomId: string, combination: string[]) {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });
    
        const response = await fetch(`${path}/api/morpho/combination`, {
            method: 'POST',
            headers: theHeader,
            body: JSON.stringify({
                roomId: roomId,
                combination: combination
            })
        });
    
        try {
            if (response.ok) {
                console.log('Combination successfully sent to backend.');
            } else {
                console.error('Failed to send combination to backend.');
            }
        } catch (error) {
            console.error('Error while sending combination to backend:', error);
        }
    }    
}

const morphoService = new MorphoService();
export default morphoService;
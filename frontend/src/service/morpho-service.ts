import { produce } from "immer"
import { MBParameter, store } from "../model"
import path from "./service-const"
<<<<<<< Updated upstream
import {MBCombination} from "../model/mbcombination";
=======
import { Realization } from "src/model/realization";
>>>>>>> Stashed changes

class MorphoService {
    async getParameterForRoom(roomId: string) {

        //fetch
        if (!roomId) return null;

        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/morpho/${roomId}/parameter`, {
            method: 'GET',
            headers: theHeader
        });
        try {
            const parameters: MBParameter[] = await response.json();
<<<<<<< Updated upstream
            // console.log("parameters here");
            // console.log(parameters);
=======
>>>>>>> Stashed changes

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

    async getCombinationsForRoom (roomId: string) {
        //fetch
        if (!roomId) return null;

        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });
        const response = await fetch(`${path}/api/morpho/${roomId}/combination`, {
            headers: theHeader
        });
        try {
            const combinations: MBCombination[] = await response.json();
            // console.log("combinations here");
            // console.log(combinations);

<<<<<<< Updated upstream
=======
            //add parameter to store
>>>>>>> Stashed changes
            const model = produce(store.getValue(), draft => {
                draft.combinations = combinations;
            });

            store.next(model);
<<<<<<< Updated upstream
=======
            return parameter;
>>>>>>> Stashed changes
        }
        catch (error) {
            console.log(`error in getParameterForRoom for ${roomId}`);
            console.log(error);
            return null;
        }

<<<<<<< Updated upstream
    }
    async saveRealization(paramId: number, content: string, contentId: number|null = null) {
=======
    async createRealization(paramId: number, content: string): Promise<Realization> {

>>>>>>> Stashed changes
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });

        const tempJson = JSON.stringify({
            'paramId': paramId,
            'content': content
<<<<<<< Updated upstream
        });
            
        let response;

        if (contentId) {
            response = await fetch(`${path}/api/morpho/realization/${contentId}`, {
                method: 'PUT',
                headers: theHeader,
                body: tempJson
            });
        } else {
            response = await fetch(`${path}/api/morpho/realization`, {
                method: 'POST',
                headers: theHeader,
                body: tempJson
            });
        }
    
=======
        })

        const response = await fetch(`${path}/api/morpho/realization`, {
            method: 'POST',
            headers: theHeader,
            body: tempJson
        });
>>>>>>> Stashed changes
        try {
            const newRealization: Realization = await response.json();
            
            //add realization to store
            const model = produce(store.getValue(), draft => {
                const parameter = draft.parameters.find(parameter => parameter.paramId === paramId);
                console.log('currParameter',parameter);
                
                parameter.realizations.push(newRealization);
            });
            store.next(model);

            return newRealization;
        }
        catch (error) {
            console.log(`Error in createParameterForRoom ${error}`);
        }
    }

    async updateRealization(contentId: number, content: string) {
        //todo: update realization 
    }

    async saveParameter(title: string, roomId: string, paramId: number|null = null) {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });

        const tempJson = JSON.stringify({
            'title': title,
            'roomId': roomId
        })

<<<<<<< Updated upstream
        let response;

        // use overwrite if paramid is there
        if (paramId) {
            response = await fetch(`${path}/api/morpho/parameter/${paramId}`, {
                method: 'PUT',
                headers: theHeader,
                body: tempJson
            });
        } else {
            response = await fetch(`${path}/api/morpho/parameter`, {
                method: 'POST',
                headers: theHeader,
                body: tempJson
            });
        }
=======
        const response = await fetch(`${path}/api/morpho/parameter`, {
            method: 'POST',
            headers: theHeader,
            body: tempJson
        });

        //todo: update store

>>>>>>> Stashed changes
        try {
            if (response.ok) {
                console.log('Parameter successfully sent to backend.');
            } else {
                console.error('Failed to send parameter to backend.');
            }
        } catch (error) {
            console.error('Error while sending parameter to backend:', error);
        }
    }

    async saveCombination(roomId: string, memberId: string, combination: string) {
        const theHeader = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        });

        const tempJson = JSON.stringify({
            'morphologicalRoomId': roomId,
            'memberId': memberId,
            'combinationText': combination
        })

        const response = await fetch(`${path}/api/morpho/combination`, {
            method: 'POST',
            headers: theHeader,
            body: tempJson
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
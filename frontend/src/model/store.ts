import { BehaviorSubject } from "rxjs";
import { Model } from "./model";

const initialState : Model = {
    ideas: [],
    rooms: [],
    users: [],
    participations: [],
    activeRoomId: "",
    thisUserId: "",
    isRoomList: false,
    remaining: null,
    parameters: [],
    combinations: []
}

export const store = new BehaviorSubject<Model> (initialState)


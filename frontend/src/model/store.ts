import { BehaviorSubject } from "rxjs";
import { Model } from "./model";

const initialState : Model = {
    ideas: [],
    rooms: []
}

export const store = new BehaviorSubject<Model> (initialState)


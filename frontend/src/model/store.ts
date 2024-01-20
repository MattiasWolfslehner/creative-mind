import { BehaviorSubject } from "rxjs";
import { Model } from "./model";

const initialState : Model = {
    ideas: []
}

export const store = new BehaviorSubject<Model> (initialState)


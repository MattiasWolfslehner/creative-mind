import { BehaviorSubject } from "rxjs";
import { Model } from "./model";

const initialState : Model = {
    todos: []
}

export const store = new BehaviorSubject<Model> (initialState)


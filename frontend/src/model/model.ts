import { Idea } from "./idea";
import { Room } from "./room";
import { User } from "./user";

export interface Model {
   readonly ideas: Idea[]
   readonly rooms: Room[]
   readonly users: User[]
}


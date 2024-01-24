import { Idea } from "./idea";
import { Room } from "./room";

export interface Model {
   readonly ideas: Idea[]
   readonly rooms: Room[]
}


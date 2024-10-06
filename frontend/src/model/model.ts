import { Idea } from "./idea";
import { Room } from "./room";
import { User } from "./user";
import {Participation} from "./participation";
import {MBParameter} from "./mbparameter";

export interface Model {
   readonly ideas: Idea[],
   readonly rooms: Room[],
   readonly users: User[],
   readonly participations: Participation[],
   readonly activeRoomId : string,
   readonly thisUserId : string,
   readonly isRoomList : boolean,
   readonly parameters: MBParameter[],
   readonly remaining : number | null
}


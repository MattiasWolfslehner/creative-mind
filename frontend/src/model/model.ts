import { Idea } from "./idea";
import { Room } from "./room";
import { User } from "./user";
import {Participation} from "./participation";
import {MBParameter} from "./mbparameter";
import {MBCombination} from "./mbcombination";

export interface Model {
   readonly ideas: Idea[],
   readonly rooms: Room[],
   readonly users: User[],
   readonly participations: Participation[],
   readonly activeRoomId : string,
   readonly thisUserId : string,
   readonly isRoomList : boolean,
   readonly parameters: MBParameter[],
   readonly combinations: MBCombination[],
   readonly remaining : number | null
}


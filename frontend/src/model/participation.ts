import {User} from "./user";
import {Room} from "./room";

export interface Participation {
    "member": User,
    "room": Room
}
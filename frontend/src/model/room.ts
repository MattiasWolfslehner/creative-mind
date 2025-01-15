export interface Room {
    "roomState": "OPEN"|"CREATED"|"STARTED"|"STOPPED",
    "roomId": string,
    "type": "brainwritingroom" | "brainstormingroom" | "morphologicalroom",
    "adminId": string,
    "name": string,
    "description": string,
}
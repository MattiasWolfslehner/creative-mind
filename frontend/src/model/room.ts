export interface Room {
    "roomState": "OPEN"|"CREATED"|"STARTED"|"STOPPED",
    "roomId": string,
    "type": "brainwritingroom" | "brainstormingroom",
    "adminId": string,
    "name": string,
}
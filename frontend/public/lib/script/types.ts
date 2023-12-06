export interface Idea {
  id: number | null;
  content: string | null;
}

export interface Room {
  id: number;
  roomId: string;
  type: string;
}

export interface User {
  id: number;
  userId: string;
}

export interface RoomRequest {
  content: string;
  roomId: string;
  memberId: string;
}

export interface IdeaRequest {
  content: string;
  roomId: string;
  memberId: string;
}

export interface ParticipationRequest {
  roomType: string;
  roomId: string;
  memberId: string;
}

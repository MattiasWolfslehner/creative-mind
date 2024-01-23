import {
  getRooms,
  addRoom,
  addUser,
  getUsers,
  addIdea,
  getIdeas,
} from '../public/lib/script/api/api';
import {Room, User, Idea, RoomRequest} from '../public/lib/script/types';
import {describe, expect, test} from '@jest/globals';
import * as express from 'express';
import * as cors from 'cors';

// INFO:
// expects can not be put in a function, to keep the code clean, sadly...

const app = express();
const PORT = 5000;

app.use(cors());

const server = app.listen(PORT, () => {
  console.log(`FRONTEND listening on http://localhost:${PORT}`);
});

describe('API Functions', () => {
  test('addUser should send a POST request and return the new user', async () => {
    const createdUser: User | null = await addUser();

    expect(createdUser).toBeDefined();
    expect(createdUser).toHaveProperty('userId');
  });

  test('addRoom should send a POST request and return the new room', async () => {
    const type = 'brainwritingroom';

    const createdRoom: Room | null = await addRoom(type);
    expect(createdRoom).toBeDefined();
    expect(createdRoom).toHaveProperty('roomId');
    expect(createdRoom).toHaveProperty('type');
  });

  test('addIdea should send a POST request and return the new idea', async () => {
    const type = 'brainwritingroom';
    const createdRoom: Room | null = await addRoom(type);
    const roomId = createdRoom?.roomId ?? null;

    const createdUser: User | null = await addUser();
    const userId = createdUser?.userId ?? null;

    if (roomId === null || userId === null) {
      throw new Error('roomId or userId is null');
    }

    expect(createdRoom).toBeDefined();
    expect(createdRoom).toHaveProperty('roomId');
    expect(createdRoom).toHaveProperty('type');

    expect(createdUser).toBeDefined();
    expect(createdUser).toHaveProperty('userId');

    const newIdeaRequest: RoomRequest = {
      content: 'rewrite the project in sveltkit, because webpack sucks',
      roomId: roomId,
      memberId: userId,
    };

    const createdIdea: Idea | null = await addIdea(newIdeaRequest);
    expect(createdIdea).toBeDefined();
  });

  test('getUsers should fetch and return users', async () => {
    const users: User[] = await getUsers();
    expect(users).toBeDefined();
  });

  test('getRooms should fetch and return rooms', async () => {
    const rooms: Room[] = await getRooms();
    expect(rooms).toBeDefined();
  });

  test('getIdeas should fetch and return ideas', async () => {
    const type = 'brainwritingroom';
    const createdRoom: Room | null = await addRoom(type);
    const roomId = createdRoom?.roomId ?? null;

    if (roomId === null) {
      throw new Error('roomId is null');
    }

    expect(createdRoom).toBeDefined();
    expect(createdRoom).toHaveProperty('roomId');
    expect(createdRoom).toHaveProperty('type');

    const ideas: Idea[] = await getIdeas(roomId);
    expect(ideas).toBeDefined();
  });
});

global.afterAll(() => {
  server.close();
});

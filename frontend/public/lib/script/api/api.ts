import {Idea, Room, User, RoomRequest} from '../types';

const restPort = 8080; // 127.0.0.1 needed for tests. else -> ::1 => Error

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchJson(url: string, config: RequestInit): Promise<any> {
  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      console.error(`Request failed. Status: ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function getRooms(): Promise<Room[]> {
  const config: RequestInit = {
    headers: {
      Accept: 'application/json',
    },
  };

  return await fetchJson(`http://127.0.0.1:${restPort}/api/rooms/list`, config);
}

async function addRoom(type: string): Promise<Room | null> {
  const config: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: type,
    }),
  };

  return await fetchJson(
    `http://127.0.0.1:${restPort}/api/rooms/create`,
    config,
  );
}

async function getUsers(): Promise<User[]> {
  const config: RequestInit = {
    headers: {
      Accept: 'application/json',
    },
  };

  return await fetchJson(`http://127.0.0.1:${restPort}/api/users/list`, config);
}

async function addUser(): Promise<User | null> {
  const config: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}), // needs empty body!
  };

  return await fetchJson(
    `http://127.0.0.1:${restPort}/api/users/register`,
    config,
  );
}

async function addIdea(request: RoomRequest): Promise<Idea | null> {
  const config: RequestInit = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  };

  return await fetchJson(`http://127.0.0.1:${restPort}/api/ideas/`, config);
}

async function getIdeas(roomId: string): Promise<Idea[]> {
  const config: RequestInit = {
    headers: {
      Accept: 'application/json',
    },
  };

  return await fetchJson(
    `http://127.0.0.1:${restPort}/api/ideas/${roomId}`,
    config,
  );
}

async function getDownload(roomId: string): Promise<Blob | null> {
  try {
    const href = `http://127.0.0.1:${restPort}/api/rooms/${roomId}/download/csv`;
    const response = await fetch(href);

    if (!response.ok) {
      console.error(`Request failed. Status: ${response.status}`);
      return null;
    }

    return await response.blob();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export {getRooms, addRoom, addUser, getUsers, addIdea, getIdeas, getDownload};

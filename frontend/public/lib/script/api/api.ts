import { Idea, Room, User, RoomRequest } from "../types";

const restPort = 8080;

async function getRooms(): Promise<Room[]> {
  let parsedData: Room[] = [];

  const config = {
    headers: {
      Accept: "application/json",
    },
  };

  parsedData = await fetch(
    `http://localhost:${restPort}/api/rooms/list`,
    config
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.info(data);
      return data;
    })
    .catch((err) => {
      console.error(err);
    });

  return parsedData;
}

async function addRoom(room: Room): Promise<Room | null> {
  let responseRoom: Room | null = null;

  let config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: room,
    }),
  };

  responseRoom = await fetch(
    `http://localhost:${restPort}/api/rooms/create`,
    config
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.info(data);
      return data;
    })
    .catch((err) => {
      console.error(err);
    });

  return responseRoom;
}

async function getUsers(): Promise<User[]> {
  const config = {
    headers: {
      Accept: "application/json",
    },
  };

  let parsedData: User[] = [];

  parsedData = await fetch(
    `http://localhost:${restPort}/api/users/list`,
    config
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.info(data);
      return data;
    })
    .catch((err) => {
      console.error(err);
    });

  return parsedData;
}

async function addUser(): Promise<User | null> {
  let responseUser: User | null;
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  responseUser = await fetch(
    `http://localhost:${restPort}/api/users/register`,
    config
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.info(data);
      return data;
    })
    .catch((err) => {
      console.error(err);
    });

  return responseUser;
}

async function addIdea(request: RoomRequest): Promise<Idea | null> {
  let responseIdea: Idea | null;
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type: request,
    }),
  };

  responseIdea = await fetch(`http://localhost:${restPort}/api/ideas/`, config)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.info(data);
      return data;
    })
    .catch((err) => {
      console.error(err);
    });
  return responseIdea;
}

async function getIdeas(): Promise<Idea[]> {
  let ideas: Idea[] = [];
  const config = {
    headers: {
      Accept: "application/json",
    },
  };

  ideas = await fetch(`http://localhost:${restPort}/api/ideas/`, config)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.info(data);
      return data;
    })
    .catch((err) => {
      console.error(err);
    });

  return ideas;
}

export { getRooms, addRoom, addUser, getUsers, addIdea, getIdeas };

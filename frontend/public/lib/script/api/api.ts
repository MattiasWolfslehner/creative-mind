import axios, {AxiosResponse} from 'axios'; // TODO: REPLACE AXIOS WITH BROWSER FETCH
import {Idea, Room, User} from '../types';

const restPort = 8080;
const host = 'http://localhost';

async function getRooms(): Promise<AxiosResponse<Room[]>> {
  const config = {
    headers: {
      Accept: 'application/json',
    },
  };

  try {
    const response = await axios.get(
      `${host}:${restPort}/api/rooms/list`,
      config,
    );
    // console.log(response.data);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function addRoom(roomType: String): Promise<AxiosResponse<any>> {
  try {
    const response = await axios.post(
      `${host}:${restPort}/api/rooms/create`,
        {type: roomType},
    );
    // console.log('room added successfully: ' + response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getUsers(): Promise<AxiosResponse<User[]>> {
  const config = {
    headers: {
      Accept: 'application/json',
    },
  };

  try {
    const response = await axios.get(
      `${host}:${restPort}/api/users/list`,
      config,
    );
    // console.log(response.data);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function addUser(): Promise<AxiosResponse<any>> {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post(
      `${host}:${restPort}/api/users/register`,
      config,
    );
    // console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function addIdea(
  content: String,
  roomId: String,
  memberId: String,
): Promise<AxiosResponse<any>> {
  const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const data = {
    content: content,
    roomId: roomId,
    memberId: memberId,
  };
  try {
    return await axios.post(
      `${host}:${restPort}/api/ideas/`,
      data,
      config,
    );
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getIdeas(roomId:string): Promise<AxiosResponse<Idea[]>> {
  const config = {
    headers: {
      Accept: 'application/json',
    },
  };

  try {
    const response = await axios.get(
      `${host}:${restPort}/api/ideas/${roomId}`,
      config,
    );
    // console.log(response.data);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export {getRooms, addRoom, addUser, getUsers, addIdea, getIdeas};

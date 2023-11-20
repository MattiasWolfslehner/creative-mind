// TODO: put api logic here
import axios from "axios";
import { Idea, Room, User } from "../types";

const restPort = 8080;

async function getRooms(): Promise<Room[]> {
    const config = {
        headers: {
            Accept: 'application/json'
        }
    }

    try {
        const response = await axios.get(`http://localhost:${restPort}/api/rooms/list`,config);
        console.log(response.data);
        return response.data; 
    } catch (error) {
        console.log(error);
        throw error;
    }
}

async function addRoom(roomType: String) {
    try{
        const response = await axios.post(`http://localhost:${restPort}/api/rooms/create`,roomType)
        .then(function (response){
            console.log("room added successfully: "+ response);
            return response.data;
        })
        .catch(function (error){
            console.log(error);
            
        })
    }catch(error){
        console.log(error);
        throw error;    
    }
}

async function getUsers(): Promise<User[]> {
    const config = {
        headers: {
            Accept: 'application/json'
        }  
    }

    try {
        const response = await axios.get(`http://localhost:${restPort}/api/users/list`,config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    } 
}

async function addUser() {
    const config = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }
   axios.post(`http://localhost:${restPort}/api/users/register`,config)
   .then(function (response){
    console.log(response);
    return response.data;
   })
   .catch(function (error){
    console.log(error);
   });
}

async function addIdea(content: String, roomId: String, memberId: String) {
    const config = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        }
    }

    const data = {
        "content": content,
        "roomId": roomId,
        "memberId": memberId
    }
    try {
        const response = await axios.post(`http://localhost:${restPort}/api/ideas/`,data,config)
    } catch (error) {
        console.log(error);
        throw error;        
    }
}

async function getIdeas(): Promise<Idea[]> {
    const config = {
        headers: {
            Accept: 'application/json'
        }  
    }

    try {
        const response = await axios.get(`http://localhost:${restPort}/api/ideas/`,config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    } 
}



export{getRooms};
export{addRoom};
export{addUser};
export{getUsers};
export{addIdea};
export{getIdeas};

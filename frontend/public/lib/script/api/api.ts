// TODO: put api logic here
import axios from "axios";
import { User } from "../types";

const restPort = 8080;

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
   axios.post(`http://localhost:${restPort}/api/users/register`,{

   })
   .then(function (response){
    console.log(response);
    return response.data;
   })
   .catch(function (error){
    console.log(error);
   });
}


export{addUser};
export{getUsers};

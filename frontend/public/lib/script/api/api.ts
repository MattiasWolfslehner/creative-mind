// TODO: put api logic here
import axios from "axios";
import { User } from "../types";

async function getUsers(): Promise<User[]> {
    const config = {
        headers: {
            Accept: 'application/json'
        }  
    }

    try {
        const response = await axios.get('http://localhost:8080/api/users/list',config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    } 
}



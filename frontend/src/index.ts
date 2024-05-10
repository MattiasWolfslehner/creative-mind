import Keycloak from 'keycloak-js';
import {router} from '../router';
import roomService from './service/room-service';
import {Room, User, store} from "./model";
import {produce} from "immer";


const keycloak = new Keycloak({
    url: 'http://localhost:8000',
    realm: 'cmr',
    clientId: 'frontend'
});

router.resolve();

async function init() {

    try{
        const authenticated = await keycloak.init({enableLogging:true});
        console.log(`User is ${authenticated ? 'authenticated': 'not authenticated'}`);
        if(!authenticated){
            await keycloak.login();
        }
        
        localStorage.setItem("token",keycloak.token)

        //senden mit bearer an das Backend
        const headers = new Headers({
            'Authorization': 'Bearer '+ localStorage.getItem("token")
        });
        console.log(keycloak.token);
        
        fetch('http://localhost:8080/api/users/register',{
            method: 'GET',
            headers: headers,
        })
        .then(response => {
              return response.json();
        })
        .then(data => {
            let user: User = data
            console.log('Response from Quarkus backend:', user);

            const model = produce(store.getValue(), draft => {
                draft.thisUserId = user.userId;
            });
            store.next(model);

            // we are logged in now ... fetch data
            const rooms = roomService.getRooms();
            //console.log(rooms);
            let url: string = router.getCurrentLocation().url.toString();
            if (url !== "") {
                // not in main path => look for rooms
                if (url.startsWith("#/room/")) {
                    //console.log(`Start immediately in room! ... ${url}`);
                    let idxSign = url.indexOf("&");
                    if (idxSign == -1) {
                        idxSign = url.length;
                    }
                    let roomId = url.substring(7, idxSign);
                    console.log(roomId);
                    const room: Promise<void | Room> = roomService.getRoom(roomId).then(value => {
                        const model = produce(store.getValue(), draft => {
                            draft.activeRoomId = roomId;
                        });
                        store.next(model);
                    });
                } else {
                    // nope
                    router.navigate("/");
                }
            }
          })
          .catch(error => {
            console.error('Error communicating with Quarkus backend:', error);
          });

    }catch(error){
        console.error('Failed to initialize adapter: ', error);
        
    }
}

init();


import "./components/app";

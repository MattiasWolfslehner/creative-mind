import Keycloak from "keycloak-js";
import path from "./service-const";
import {Room, store, User} from "../model";
import {produce} from "immer";
import roomService from "./room-service";
import {router} from "../../router";

const keycloak = new Keycloak({
    url: 'http://localhost:8000',
    realm: 'cmr',
    clientId: 'frontend'
});

class KeycloakService {

    public async init () {
        if(!keycloak.token){
        alert("init")
        try {
            const authenticated = await keycloak.init({enableLogging: true});
            console.log(`User is ${authenticated ? 'authenticated' : 'not authenticated'}`);
            if (authenticated) {
                alert("Juhu")
            }
        } catch (error) {
            console.error('Failed to initialize adapter: ', error);
        }
    }else{
        console.log("already logged in ", keycloak.token);
        
    }
    }

    public logout() {
        try {
            localStorage.setItem("token",null);
            const model = produce(store.getValue(), draft => {
                draft.thisUserId = '';
            });
            store.next(model);
            keycloak.logout().then(()=>{console.log("logout successful!")});
        } catch (error) {
            console.error('Failed to logout: ', error);
        }
    }

    public async login() {

        try {
            const authenticated =keycloak.authenticated;
                //await KeycloakService.keycloak.init({enableLogging: true});
            console.log(`User is ${authenticated ? 'authenticated' : 'not authenticated'}`);
            if (!authenticated) {
                await keycloak.login();
            }

            localStorage.setItem("token", keycloak.token);

            //senden mit bearer an das Backend
            const headers = new Headers({
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            });
            console.log(keycloak.token);

            fetch(`${path}/api/users/register`, {
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
                            const room: Promise<void | Room> = roomService.getRoom(roomId).then(value => {
                                const model = produce(store.getValue(), draft => {
                                    draft.activeRoomId = roomId;
                                });
                                store.next(model);
                            });
                        } else {
                            // nope
                            router.navigate("");
                        }
                    }
                })
                .catch(error => {
                    console.error('Error communicating with Quarkus backend:', error);
                });

        } catch (error) {
            console.error('Failed to initialize adapter: ', error);
        }
    }
}


const keycloakService = new KeycloakService();
keycloakService.init();

export default keycloakService;

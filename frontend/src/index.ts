import {router} from '../router';
import {store} from "./model";
import {produce} from "immer";
import Keycloak from 'keycloak-js';

router.resolve();


router.on('/', () => {
    console.log("go home ccc");
    const model = produce(store.getValue(), draft => {
        draft.isRoomList = false;
        draft.activeRoomId = "";
        draft.ideas = [];
        draft.parameters = [];
        draft.combinations = [];
    });
    store.next(model);
});
router.on('', () => {
    console.log("go home ddd");
    const model = produce(store.getValue(), draft => {
        draft.isRoomList = false;
        draft.activeRoomId = "";
        draft.ideas = [];
        draft.parameters = [];
        draft.combinations = [];
    });
    store.next(model);
});

const keycloak = new Keycloak({
    url: 'http://localhost:8000',
    realm: 'cmr',
    clientId: 'frontend'
});

try {
    const authenticated = await keycloak.init({enableLogging: true, onLoad: "login-required"});
    console.log(`User is ${authenticated ? 'authenticated' : 'not authenticated'}`);
    if (authenticated) {
        alert(`Juhu ${keycloak.token}`)
    }
} catch (error) {
    console.error('Failed to initialize adapter: ', error);
}

import "./components/app";



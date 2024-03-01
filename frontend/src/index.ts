import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8000',
    realm: 'cmr',
    clientId: 'frontend'
});

async function init() {
    try{
        const authenticated = await keycloak.init({enableLogging:true});
        console.log(`User is ${authenticated ? 'authenticated': 'not authenticated'}`);
        if(!authenticated){
            await keycloak.login();
        }
    }catch(error){
        console.error('Failed to initialize adapter: ', error);
        
    }
}
init();

import "./components/app"



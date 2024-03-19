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
        

        //TODO: senden mit bearer an das Backend
        const headers = new Headers({
            'Authorization': 'Bearer '+ keycloak.token
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
            console.log('Response from Quarkus backend:', data);
          })
          .catch(error => {
            console.error('Error communicating with Quarkus backend:', error);
          });

    }catch(error){
        console.error('Failed to initialize adapter: ', error);
        
    }
}
init();

import "./components/app"



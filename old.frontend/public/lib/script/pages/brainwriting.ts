
import {localStorageAction} from '../actions/store';
let roomId: string | null = null;

// get roomId from localStorage

localStorageAction.load<string>('roomId')
  .then(loadedRoomId => {
    if (loadedRoomId != null) {
      roomId = loadedRoomId;
      console.log("room: " + roomId);
    } else {
      window.history.go(-1);
    }
  })
  .catch(error => {
    console.error(`Error loading roomId: ${error}`);
    window.history.go(-1);
  });

// with the roomId > get all the data from the backend

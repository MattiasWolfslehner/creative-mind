import {router} from '../router';
import {store} from "./model";
import {produce} from "immer";

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

import "./components/app";


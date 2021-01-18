import { combineReducers } from "redux";

import errorReducer from "./error";
import sessionReducer from "./session";
import roomReducer from "./room";
import roomsReducer from "./rooms";
import windowSizeReducer from "./windowSize";
import claimAccountReducer from "./claimAccount";

export default combineReducers({
    error: errorReducer,
    session: sessionReducer,
    room: roomReducer,
    rooms: roomsReducer,
    windowSize: windowSizeReducer,
    claimAccount: claimAccountReducer,
});

import { combineReducers } from "redux";

import errorReducer from "./error";
import sessionReducer from "./session";
import roomReducer from "./room";
import windowSizeReducer from "./windowSize";
import claimAccountReducer from "./claimAccount";

export default combineReducers({
    error: errorReducer,
    session: sessionReducer,
    room: roomReducer,
    windowSize: windowSizeReducer,
    claimAccount: claimAccountReducer,
});

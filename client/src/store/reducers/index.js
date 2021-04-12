import { combineReducers } from "redux";

import errorReducer from "./error";
import sessionReducer from "./session";
import roomReducer from "./room";
import claimAccountReducer from "./claimAccount";

export default combineReducers({
    error: errorReducer,
    session: sessionReducer,
    room: roomReducer,
    claimAccount: claimAccountReducer,
});

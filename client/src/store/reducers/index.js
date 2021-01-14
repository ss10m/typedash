import { combineReducers } from "redux";

import sessionReducer from "./session";
import roomsReducer from "./rooms";
import windowSizeReducer from "./windowSize";
import claimAccountReducer from "./claimAccount";

export default combineReducers({
    session: sessionReducer,
    rooms: roomsReducer,
    windowSize: windowSizeReducer,
    claimAccount: claimAccountReducer,
});

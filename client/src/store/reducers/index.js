import { combineReducers } from "redux";

import sessionReducer from "./session";
import roomsReducer from "./rooms";
import windowSizeReducer from "./windowSize";

export default combineReducers({
    session: sessionReducer,
    rooms: roomsReducer,
    windowSize: windowSizeReducer,
});

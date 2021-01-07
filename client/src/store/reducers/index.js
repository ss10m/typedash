import { combineReducers } from "redux";

import sessionReducer from "./session";
import windowSizeReducer from "./windowSize";
import socketReducer from "./socket";

export default combineReducers({
    session: sessionReducer,
    windowSize: windowSizeReducer,
    socket: socketReducer,
});

import { combineReducers } from "redux";

import sessionReducer from "./session";
import windowSizeReducer from "./windowSize";

export default combineReducers({
    session: sessionReducer,
    windowSize: windowSizeReducer,
});

import { combineReducers } from "redux";
import errorReducer from "./error";
import sessionReducer from "./session";

export default combineReducers({
    error: errorReducer,
    session: sessionReducer,
});

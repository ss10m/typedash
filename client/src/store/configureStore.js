import { applyMiddleware, createStore } from "redux";
import reducers from "./reducers";

import thunkMiddleware from "redux-thunk";
import socketMiddleware from "./middlewares/socketMiddleware";

const configureStore = (socketClient) => {
    const middleware = [thunkMiddleware, socketMiddleware(socketClient)];
    return createStore(reducers, applyMiddleware(...middleware));
};

export default configureStore;

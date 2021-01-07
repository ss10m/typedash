// Libraries & utils
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";

// Redux
import { Provider } from "react-redux";
import configureStore from "./store/configureStore";

// Components
import App from "./components/App";

import SocketClient from "./SocketClient";

const client = new SocketClient();
const store = configureStore(client);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Route component={App} />
        </BrowserRouter>
    </Provider>,
    document.getElementById("root")
);

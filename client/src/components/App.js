// Libraries & utils
import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getSession } from "store/actions";

// Components
import Navbar from "./Navbar/Navbar";
import Login from "./Login/Login";
import Rooms from "./Rooms/RoomsContainer";
import Racer from "./Racer/Racer";
import WindowSize from "./WindowSize/WindowSize";

// SCSS
import "./App.scss";

const App = () => {
    const session = useSelector((state) => state.session);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSession());
    }, [dispatch]);

    if (!session.isLoaded) return <div>Loading...</div>;

    return (
        <>
            <WindowSize />
            <div className="app no-select">
                <div className="main">
                    <div className="sides">
                        <Navbar />
                        <Switch>
                            <Route exact path="/" render={() => <h1>main</h1>}></Route>
                            <Route exact path="/battle" component={Racer} />
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/rooms" component={Rooms} />
                            <Route exact path="/profile" render={() => <h1>profile</h1>} />
                            <Route render={() => <h1>404</h1>} />
                        </Switch>
                    </div>
                </div>
            </div>
        </>
    );
};

export default App;

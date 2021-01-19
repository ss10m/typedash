// Libraries & utils
import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getSession } from "store/actions";

// Components
import Landing from "./Landing/Landing";
import Navbar from "./Navbar/Navbar";
import Room from "./Room/Room";
import Rooms from "./Rooms/Rooms";
import Racer from "./Racer/Racer";
import ClaimAccount from "./ClaimAccount/ClaimAccount";
import WindowSize from "./WindowSize/WindowSize";

// SCSS
import "./App.scss";

const App = () => {
    const { session, error, claimAccount, room } = useSelector((state) => state);
    const state = useSelector((state) => state);
    console.log(state);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSession());
    }, [dispatch]);

    let view;
    if (!session.isLoaded) {
        view = null;
    } else if (error) {
        view = <div>{error}</div>;
    } else if (!session.user) {
        view = <Landing />;
    } else if (room) {
        view = <Room />;
    } else {
        view = (
            <div className="sides">
                <Navbar />
                <Switch>
                    <Route exact path="/" render={() => <h1>main</h1>}></Route>
                    <Route path="/battle" component={Racer} />
                    <Route path="/rooms" component={Rooms} />
                    <Route path="/profile" render={() => <h1>profile</h1>} />
                    <Route render={() => <h1>404</h1>} />
                </Switch>
            </div>
        );
    }

    return (
        <>
            <WindowSize />
            {claimAccount && <ClaimAccount />}
            <div className="app no-select">
                <div className="inner">{view}</div>
            </div>
        </>
    );
};

export default App;

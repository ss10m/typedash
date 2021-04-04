// Libraries & utils
import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { getSession } from "store/actions";

// Components
import Error from "./Error/Error";
import Landing from "./Landing/Landing";
import Navbar from "./Navbar/Navbar";
import Room from "./Room/Room";
import Rooms from "./Rooms/Rooms";
import Highscores from "./Highscores/Highscores";
import Profile from "./Profile/Profile";
import Quotes from "./Quotes/Quotes";
import ClaimAccount from "./ClaimAccount/ClaimAccount";
import WindowSize from "./WindowSize/WindowSize";

// SCSS
import "./App.scss";

const App = () => {
    const { session, error, claimAccount } = useSelector((state) => state);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSession());
    }, [dispatch]);

    if (!session.isLoaded) {
        return null;
    } else if (error) {
        return <Error msg={error} />;
    } else if (!session.user) {
        return <Landing />;
    } else if (!session.isConnected) {
        return null;
    }

    return (
        <>
            <WindowSize />
            {claimAccount && <ClaimAccount />}
            <div className="app no-select">
                <div className="inner">
                    <Navbar />
                    <Switch>
                        <Route exact path="/">
                            <Rooms />
                        </Route>
                        <Route path="/room/:id">
                            <Room />
                        </Route>
                        <Route path="/highscores">
                            <Highscores />
                        </Route>
                        <Route path="/quotes">
                            <Quotes />
                        </Route>
                        <Route path="/profile/:username">
                            <Profile />
                        </Route>
                        <Route>
                            <Error msg="404 NOT FOUND" />
                        </Route>
                    </Switch>
                </div>
            </div>
        </>
    );
};

export default App;

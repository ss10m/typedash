// Libraries & utils
import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import WebFont from "webfontloader";

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

// Styles
import * as Styles from "./styles";

const App = () => {
    const { session, error, claimAccount } = useSelector((state) => state);
    const dispatch = useDispatch();

    useEffect(() => {
        WebFont.load({
            google: {
                families: ["Jost:100,200,300,400,500,600,700,800"],
            },
        });
    }, []);

    useEffect(() => {
        dispatch(getSession());
    }, [dispatch]);

    if (!session.isLoaded) {
        return null;
    } else if (error) {
        return (
            <Styles.App>
                <Styles.GlobalStyle />
                <Error msg={error} forceRefresh />
            </Styles.App>
        );
    } else if (!session.user) {
        return (
            <>
                <Styles.GlobalStyle />
                <Landing />
            </>
        );
    } else if (!session.isConnected) {
        return null;
    }

    return (
        <>
            <Styles.GlobalStyle />
            <Styles.App>
                <div>
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
                            <Error />
                        </Route>
                    </Switch>
                    {claimAccount && <ClaimAccount />}
                </div>
            </Styles.App>
        </>
    );
};

export default App;

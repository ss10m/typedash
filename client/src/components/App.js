// Libraries & utils
import React, { useState, useEffect } from "react";
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
import Settings from "./Settings/Settings";

// Styles
import * as Styled from "./styles";

const App = () => {
    const dispatch = useDispatch();
    const { session, error } = useSelector((state) => state);
    const [showSettings, setShowSettings] = useState(false);
    const [showClaimAccount, setShowClaimAccount] = useState(false);

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
            <Styled.App>
                <Styled.GlobalStyle />
                <Error msg={error} forceRefresh />
            </Styled.App>
        );
    } else if (!session.user) {
        return (
            <>
                <Styled.GlobalStyle />
                <Landing />
            </>
        );
    } else if (!session.isConnected) {
        return null;
    }

    return (
        <>
            <Styled.GlobalStyle />
            <Styled.App>
                <div>
                    <Navbar
                        showSettings={() => setShowSettings(true)}
                        showClaimAccount={() => setShowClaimAccount(true)}
                    />
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
                    {showSettings && <Settings hide={() => setShowSettings(false)} />}
                    {showClaimAccount && (
                        <ClaimAccount hide={() => setShowClaimAccount(false)} />
                    )}
                </div>
            </Styled.App>
        </>
    );
};

export default App;

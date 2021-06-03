// Libraries & utils
import React, { useState } from "react";

// Socket API
import SocketAPI from "core/SocketClient";

// Context
import { RoomProvider, useRoomReducer } from "./context";

// Constants
import { STATE } from "helpers/constants";

// Components
import Navigation from "./Navigation/Navigation";
import Racer from "./Racer/Racer";
import Scoreboard from "./Scoreboard/Scoreboard";
import Spectating from "./Spectating/Spectating";
import Stats from "./Stats/Stats";
import Countdown from "./Countdown/Countdown";
import Charts from "../Charts/Charts";
import Results from "./Results/Results";
import Spectators from "./Spectators/Spectators";
import Error from "../Error/Error";

// Styles
import * as Styled from "./styles";

const Room = () => {
    const { data, dispatch } = useRoomReducer();

    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);

    const { room, state, isSpectating, viewSpectators, graph, error } = data;

    if (error) return <Error msg={error} />;
    if (!room) return null;

    return (
        <RoomProvider value={{ data, dispatch }}>
            <Styled.Room>
                {viewSpectators && <Spectators />}
                {state.current === STATE.COUNTDOWN && (
                    <Countdown onCancel={SocketAPI.setReady} />
                )}
                <Navigation />
                {isSpectating && (
                    <Spectating
                        setSpectate={SocketAPI.setSpectate}
                        setPlayNext={SocketAPI.setPlayNext}
                    />
                )}
                <Scoreboard
                    setSpectate={SocketAPI.setSpectate}
                    socketId={SocketAPI.getSocketId()}
                />
                <Stats wpm={wpm} accuracy={accuracy} setReady={SocketAPI.setReady} />
                <Racer
                    updateStatus={SocketAPI.updateStatus}
                    setWpm={setWpm}
                    setAccuracy={setAccuracy}
                />
                <Charts graphWpm={graph.wpm} graphAccuracy={graph.accuracy} labelX labelY />
                <Results updateResults={SocketAPI.updateResults} />
            </Styled.Room>
        </RoomProvider>
    );
};

export default Room;

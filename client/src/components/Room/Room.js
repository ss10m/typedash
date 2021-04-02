// Libraries & utils
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";

// Socket API
import SocketAPI from "core/SocketClient";

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

// SCSS
import "./Room.scss";

const Room = () => {
    const {
        room,
        state,
        isReady,
        isSpectating,
        playNext,
        players,
        spectators,
        quote,
        error,
        isRunning,
        setIsRunning,
    } = useRoomApi();

    const history = useHistory();
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [graphWpm, setGraphWpm] = useState([]);
    const [graphAccuracy, setGraphAccuracy] = useState([]);
    const [viewSpectators, setViewSpectators] = useState(false);

    if (error) return <Error msg={error} goBack={() => history.goBack()} />;
    if (!room) return null;

    const socketId = SocketAPI.getSocketId();

    return (
        <div className="room">
            {viewSpectators && (
                <Spectators spectators={spectators} setIsVisible={setViewSpectators} />
            )}
            {state.countdown && (
                <Countdown
                    duration={state.countdown}
                    isSpectating={isSpectating}
                    onCancel={SocketAPI.setReady}
                />
            )}
            <Navigation
                roomName={room.name}
                leaveRoom={history.goBack}
                setViewSpectators={setViewSpectators}
            />
            {isSpectating && (
                <Spectating
                    state={state}
                    isSpectating={isSpectating}
                    setSpectate={SocketAPI.setSpectate}
                    playNext={playNext}
                    setPlayNext={SocketAPI.setPlayNext}
                />
            )}
            <Scoreboard
                state={state}
                players={players}
                socketId={socketId}
                isSpectating={isSpectating}
                setSpectate={SocketAPI.setSpectate}
            />
            <Stats
                state={state}
                isSpectating={isSpectating}
                wpm={wpm}
                accuracy={accuracy}
                isReady={isReady}
                setReady={SocketAPI.setReady}
            />
            <Racer
                state={state}
                isRunning={isRunning && !isSpectating}
                isSpectating={isSpectating}
                setIsRunning={setIsRunning}
                currentQuote={quote}
                updateStatus={SocketAPI.updateStatus}
                setWpm={setWpm}
                setAccuracy={setAccuracy}
                setGraphWpm={setGraphWpm}
                setGraphAccuracy={setGraphAccuracy}
            />
            <Charts graphWpm={graphWpm} graphAccuracy={graphAccuracy} labelX labelY />
            <Results quote={quote} updateResults={SocketAPI.updateResults} />
        </div>
    );
};

const useRoomApi = () => {
    const history = useHistory();
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [state, setState] = useState({ current: STATE.PREGAME });
    const [isReady, setIsReady] = useState({ current: false });
    const [isRunning, setIsRunning] = useState(false);
    const [isSpectating, setIsSpectating] = useState(false);
    const [playNext, setPlayNext] = useState(false);
    const [quote, setQuote] = useState(null);
    const [players, setPlayers] = useState([]);
    const [spectators, setSpectators] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        SocketAPI.joinRoom(id);
        const socket = SocketAPI.getSocket();

        const setFunctions = {
            room: (data) => setRoom(data),
            state: (data) => setState(data),
            isReady: (data) => setIsReady({ current: data }),
            isRunning: (data) => setIsRunning(data),
            isSpectating: (data) => setIsSpectating(data),
            playNext: (data) => setPlayNext(data),
            quote: (data) => setQuote(data),
            players: (data) => setPlayers(data),
            spectators: (data) => setSpectators(data),
            error: (data) => setError(data),
            leave: () => history.push(""),
        };

        socket.on("updated-room", (data) => {
            const fields = Object.keys(data);

            for (let field of fields) {
                const setFunction = setFunctions[field];
                if (!setFunction) continue;
                setFunction(data[field]);
            }
        });

        return () => {
            socket.off("updated-room");
            SocketAPI.leaveRoom();
        };
    }, [id, history]);

    return {
        room,
        state,
        isReady,
        isSpectating,
        playNext,
        players,
        spectators,
        quote,
        error,
        isRunning,
        setIsRunning,
    };
};

export default Room;

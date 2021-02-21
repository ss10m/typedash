// Libraries & utils
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Switch from "react-switch";
import moment from "moment";
import classnames from "classnames";

// Socket API
import SocketAPI from "core/SocketClient";

// Constants
import { STATE } from "helpers/constants";

// Components
import Racer from "./Racer/Racer";
import Scoreboard from "./Scoreboard/Scoreboard";
import Timer from "./Timer/Timer";
import Countdown from "./Countdown/Countdown";
import Status from "./Status/Status";
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

    if (error) return <Error msg={error} goBack={() => history.goBack()} />;
    if (!room) return null;

    const socketId = SocketAPI.getSocketId();

    return (
        <div className="room">
            {state.countdown && (
                <Countdown
                    duration={state.countdown}
                    isSpectating={isSpectating}
                    onCancel={SocketAPI.setReady}
                />
            )}
            <div className="status">
                <button onClick={history.goBack}>LEAVE ROOM</button>
                <div>
                    <p>{state.current}</p>
                </div>
                <div>{room.name}</div>
            </div>

            <Scoreboard players={players} socketId={socketId} />
            <div>
                {spectators.map((user, index) => (
                    <div key={index}>{user.username}</div>
                ))}
            </div>

            <div className="stats">
                <Status
                    state={state}
                    isSpectating={isSpectating}
                    toggleSpectate={SocketAPI.toggleSpectate}
                    playNext={playNext}
                    setPlayNext={SocketAPI.setPlayNext}
                />
                <ReadyUp isReady={isReady} setReady={SocketAPI.setReady} />
                <Timer state={state} />
            </div>

            <Racer
                state={state}
                isRunning={isRunning && !isSpectating}
                isSpectating={isSpectating}
                setIsRunning={setIsRunning}
                currentQuote={quote}
                updateStatus={SocketAPI.updateStatus}
            />

            <Results quote={quote} />
        </div>
    );
};

const ReadyUp = ({ isReady, setReady }) => {
    const [isToggleDisabled, setIsToggleDisabled] = useState(false);

    useEffect(() => {
        setIsToggleDisabled(false);
    }, [isReady]);

    const toggle = () => {
        if (isToggleDisabled) return;
        setIsToggleDisabled(true);
        setReady(!isReady.current);
    };

    return (
        <label>
            <span>READY</span>
            <Switch onChange={toggle} checked={isReady.current} />
        </label>
    );
};

const Results = ({ quote }) => {
    const [selected, setSelected] = useState("top");
    if (!quote) return <div>No recent results</div>;

    return (
        <div className="recent-results">
            <div className="tabs">
                <div
                    className={classnames({ selected: selected === "top" })}
                    onClick={() => setSelected("top")}
                >
                    TOP
                </div>
                <div
                    className={classnames({ selected: selected === "recent" })}
                    onClick={() => setSelected("recent")}
                >
                    RECENT
                </div>
                <div
                    className={classnames({ selected: selected === "playerTop" })}
                    onClick={() => setSelected("playerTop")}
                >
                    YOUR TOP
                </div>
                <div
                    className={classnames({ selected: selected === "playerRecent" })}
                    onClick={() => setSelected("playerRecent")}
                >
                    YOUR RECENT
                </div>
            </div>
            <div className="results">
                <div className="header">
                    <div className="rank">#</div>
                    <div className="username">USERNAME</div>
                    <div className="wpm">WPM</div>
                    <div className="accuracy">ACCURACY</div>
                    <div className="time">TIME</div>
                </div>
                {quote.recent.map((score) => (
                    <div className="result">
                        <div className="rank">{score.rank}</div>
                        <div className="username">{score.display_name}</div>
                        <div className="wpm">{`${score.wpm}wpm`}</div>
                        <div className="accuracy">{`${score.accuracy}%`}</div>
                        <div className="time">{moment(score.played_at).fromNow()}</div>
                    </div>
                ))}
            </div>
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

        socket.on("updated-room", (data) => {
            const fields = Object.keys(data);

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

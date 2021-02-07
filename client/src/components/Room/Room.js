// Libraries & utils
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Switch from "react-switch";

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
                <Countdown duration={state.countdown} onCancel={SocketAPI.cancelCountdown} />
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
                    playNext={playNext}
                    toggleSpectate={SocketAPI.toggleSpectate}
                    togglePlayNext={SocketAPI.togglePlayNext}
                />
                <ReadyUp isReady={isReady} toggleReady={SocketAPI.toggleReady} />
                <Timer state={state} />
            </div>

            <Racer
                isRunning={isRunning && !isSpectating}
                setIsRunning={setIsRunning}
                currentQuote={quote}
                updateStatus={SocketAPI.updateStatus}
            />
        </div>
    );
};

const ReadyUp = ({ isReady, toggleReady }) => {
    const [isToggleDisabled, setIsToggleDisabled] = useState(false);

    const toggle = () => {
        if (isToggleDisabled) return;
        setIsToggleDisabled(true);
        toggleReady();

        setTimeout(() => {
            setIsToggleDisabled(false);
        }, 200);
    };

    return (
        <label>
            <span>READY</span>
            <Switch onChange={toggle} checked={isReady} />
        </label>
    );
};

const useRoomApi = () => {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [state, setState] = useState({ current: STATE.PREGAME });
    const [isReady, setIsReady] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [isSpectating, setIsSpectating] = useState(false);
    const [playNext, setPlayNext] = useState(false);
    const [quote, setQuote] = useState("");
    const [players, setPlayers] = useState([]);
    const [spectators, setSpectators] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const onUpdate = (data) => {
            console.log(data);

            const fields = Object.keys(data);
            for (let field of fields) {
                switch (field) {
                    case "room":
                        setRoom(data[field]);
                        break;
                    case "state":
                        setState(data[field]);
                        break;
                    case "isReady":
                        setIsReady(data[field]);
                        break;
                    case "isRunning":
                        setIsRunning(data[field]);
                        break;
                    case "isSpectating":
                        setIsSpectating(data[field]);
                        break;
                    case "playNext":
                        setPlayNext(data[field]);
                        break;
                    case "quote":
                        setQuote(data[field]);
                        break;
                    case "players":
                        setPlayers(data[field]);
                        break;
                    case "spectators":
                        setSpectators(data[field]);
                        break;
                    case "error":
                        setError(data[field]);
                        break;
                    default:
                        break;
                }
            }
        };
        SocketAPI.joinRoom(id, onUpdate);
        return () => SocketAPI.leaveRoom();
    }, [id]);

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

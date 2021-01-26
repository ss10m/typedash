// Libraries & utils
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import classNames from "classnames";

// Icons
import { FaTrophy } from "react-icons/fa";

// Socket API
import SocketAPI from "core/SocketClient";

// Constants
import { STATE } from "helpers/constants";

// Components
import Racer from "../Racer/Racer";
import Countdown from "../Countdown/Countdown";
import Error from "../Error/Error";

// SCSS
import "./Room.scss";

const Room = () => {
    const {
        room,
        state,
        players,
        spectators,
        quote,
        error,
        updateStatus,
        isRunning,
        setIsRunning,
    } = useRoomApi();

    const history = useHistory();

    if (error) return <Error msg={error} goBack={() => history.goBack()} />;
    if (!room) return null;

    return (
        <div className="room">
            {state.countdown && <Countdown duration={state.countdown} />}
            <div className="status">
                <div>{room.name}</div>
                <div>
                    <button onClick={history.goBack}>LEAVE ROOM</button>
                    <button onClick={SocketAPI.startRound}>PLAY</button>
                    <button onClick={SocketAPI.endRound}>END</button>
                </div>
                <div>
                    <p>{state.current}</p>
                </div>
            </div>
            <Players players={players} />
            <div>
                {spectators.map((user, index) => (
                    <div key={index}>{user.username}</div>
                ))}
            </div>

            <Racer
                isRunning={isRunning}
                setIsRunning={setIsRunning}
                currentQuote={quote}
                updateStatus={updateStatus}
            />
        </div>
    );
};

const nth = (d) => {
    if (d > 3 && d < 21) return `${d}th`;
    switch (d % 10) {
        case 1:
            return `${d}st`;
        case 2:
            return `${d}nd`;
        case 3:
            return `${d}rd`;
        default:
            return `${d}th`;
    }
};

const Players = ({ players }) => {
    return (
        <div className="players-wrapper">
            <div
                className={classNames("start", {
                    mini: players.length === 1,
                })}
            >
                START
            </div>
            <div className="players">
                {players.map((user) => (
                    <div key={user.id} className="player">
                        <div className="details">
                            <div className="username">{user.username}</div>
                            {user.position && (
                                <div>
                                    {nth(user.position)}
                                    <span>
                                        <FaTrophy />
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="progress" style={{ width: `${user.progress}%` }} />
                    </div>
                ))}
            </div>
            <div className="flag"></div>
        </div>
    );
};

const useRoomApi = () => {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [state, setState] = useState({ current: STATE.WAITING });
    const [players, setPlayers] = useState([]);
    const [spectators, setSpectators] = useState([]);
    const [quote, setQuote] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const onUpdate = (key, data) => {
            console.log(key, data);

            switch (key) {
                case "joined":
                    setRoom(data.room);
                    setState(data.state);
                    setPlayers(data.players);
                    setSpectators(data.spectators);
                    setQuote(data.quote.value);
                    break;
                case "updated":
                    const fields = Object.keys(data);
                    for (let field of fields) {
                        switch (field) {
                            case "players":
                                setPlayers(data[field]);
                                break;
                            case "spectators":
                                setSpectators(data[field]);
                                break;
                            case "isRunning":
                                setIsRunning(data[field]);
                                break;
                            case "state":
                                setState(data[field]);
                                break;
                            default:
                                break;
                        }
                    }
                    setRoom((room) => ({ ...room, ...data }));
                    break;
                case "error":
                    setError(data);
                    break;
                default:
                    break;
            }
        };
        SocketAPI.joinRoom(id, onUpdate);
        return () => SocketAPI.leaveRoom();
    }, [id]);

    return {
        room,
        state,
        players,
        spectators,
        quote,
        error,
        updateStatus: SocketAPI.updateStatus,
        isRunning,
        setIsRunning,
    };
};

export default Room;

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
import Racer from "./Racer/Racer";
import Timer from "./Timer/Timer";
import Countdown from "./Countdown/Countdown";
import Error from "../Error/Error";

// SCSS
import "./Room.scss";

const Room = () => {
    const {
        room,
        state,
        isSpectating,
        scoreboard,
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
            {state.countdown && (
                <Countdown duration={state.countdown} onCancel={SocketAPI.cancelCountdown} />
            )}
            <div className="status">
                <div>{room.name}</div>
                <div>
                    <button onClick={history.goBack}>LEAVE ROOM</button>
                    <button onClick={SocketAPI.startCountdown}>PLAY</button>
                    <button onClick={SocketAPI.cancelCountdown}>CANCEL</button>
                    <button onClick={SocketAPI.nextRound}>NEW ROUND</button>
                </div>
                <div>
                    <p>{state.current}</p>
                </div>
            </div>

            <Scoreboard players={scoreboard} />
            <div>
                {spectators.map((user, index) => (
                    <div key={index}>{user.username}</div>
                ))}
            </div>
            <div className="stats">
                <Status
                    isSpectating={isSpectating}
                    togglePlayNext={SocketAPI.togglePlayNext}
                />
                <Timer state={state} />
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

const Status = ({ isSpectating, togglePlayNext }) => {
    const [playingNext, setPlayingNext] = useState(false);
    const [isToggleDisabled, setIsToggleDisabled] = useState(false);

    const togglePlay = () => {
        setIsToggleDisabled(true);

        const toggled = !playingNext;
        setPlayingNext(toggled);
        togglePlayNext(toggled);

        setTimeout(() => {
            setIsToggleDisabled(false);
        }, 1000);
    };
    return (
        <div className="left">
            {isSpectating ? (
                <>
                    SPECTATING
                    <button onClick={togglePlay} disabled={isToggleDisabled}>
                        {playingNext ? "PLAYING NEXT" : "NOT PLAYING NEXT"}
                    </button>
                </>
            ) : (
                <div>NOT SPECTATING</div>
            )}
        </div>
    );
};

const Scoreboard = ({ players }) => {
    if (!players.length) return <div>Waiting for players</div>;
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
                {players.map((player) => (
                    <div key={player.id} className="player">
                        <div className={classNames("details", { left: player.leftRoom })}>
                            <div className="username">{player.username}</div>
                            {player.position && (
                                <div className="position">
                                    {player.position <= 3 && (
                                        <span style={{ color: trophyColor(player.position) }}>
                                            <FaTrophy />
                                        </span>
                                    )}
                                    {ordinalSuffix(player.position)}
                                </div>
                            )}
                        </div>
                        <div className="progress" style={{ width: `${player.progress}%` }} />
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
    const [state, setState] = useState({ current: STATE.PREGAME });
    const [isSpectating, setIsSpectating] = useState(false);
    const [scoreboard, setScoreboard] = useState([]);
    const [spectators, setSpectators] = useState([]);
    const [quote, setQuote] = useState("");
    const [isRunning, setIsRunning] = useState(false);
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
                    case "isRunning":
                        setIsRunning(data[field]);
                        break;
                    case "quote":
                        setQuote(data[field]);
                        break;
                    case "scoreboard":
                        setScoreboard(data[field]);
                        break;
                    case "spectators":
                        setSpectators(data[field]);
                        break;
                    case "isSpectating":
                        setIsSpectating(data[field]);
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
        isSpectating,
        scoreboard,
        spectators,
        quote,
        error,
        updateStatus: SocketAPI.updateStatus,
        isRunning,
        setIsRunning,
    };
};

const ordinalSuffix = (position) => {
    const j = position % 10;
    const k = position % 100;
    if (j === 1 && k !== 11) {
        return position + "st";
    }
    if (j === 2 && k !== 12) {
        return position + "nd";
    }
    if (j === 3 && k !== 13) {
        return position + "rd";
    }
    return position + "th";
};

const trophyColor = (position) => {
    switch (position) {
        case 1:
            return "#FEE101";
        case 2:
            return "#A7a7AD";
        case 3:
            return "#A77044";
        default:
            return;
    }
};

export default Room;

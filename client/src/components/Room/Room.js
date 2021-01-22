// Libraries & utils
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

// Socket API
import SocketAPI from "core/SocketClient";

// Components
import Racer from "../Racer/Racer";
import Error from "../Error/Error";

// SCSS
import "./Room.scss";

const Room = () => {
    const { room, players, spectators, quote, error, updateStatus } = useRoomApi();
    const [isRunning, setIsRunning] = useState(false);
    const history = useHistory();

    if (error) return <Error msg={error} goBack={() => history.goBack()} />;
    if (!room) return null;

    return (
        <div className="room">
            <div>{room.name}</div>
            <div>
                PLAYRES:
                {players.map((user, index) => (
                    <div key={index}>{`${user.username} - ${user.progress}`}</div>
                ))}
            </div>
            <div>
                SPECTATORS:
                {spectators.map((user, index) => (
                    <div key={index}>{user.username}</div>
                ))}
            </div>
            <button onClick={() => history.goBack()}>LEAVE ROOM</button>
            <Racer
                isRunning={isRunning}
                setIsRunning={setIsRunning}
                currentQuote={quote}
                updateStatus={updateStatus}
            />
        </div>
    );
};

const useRoomApi = () => {
    const [room, setRoom] = useState(null);
    const [players, setPlayers] = useState([]);
    const [spectators, setSpectators] = useState([]);
    const [quote, setQuote] = useState("");
    const [error, setError] = useState("");
    const { id } = useParams();

    useEffect(() => {
        const onUpdate = (key, data) => {
            console.log(key, data);

            switch (key) {
                case "joined":
                    setRoom(data.room);
                    setPlayers(data.players);
                    setSpectators(data.spectators);
                    setQuote(data.status.quote);
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

    return { room, players, spectators, quote, error, updateStatus: SocketAPI.updateStatus };
};

export default Room;

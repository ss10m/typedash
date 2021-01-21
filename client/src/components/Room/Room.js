// Libraries & utils
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

// Socket API
import SocketAPI from "core/SocketClient";

import Error from "../Error/Error";

// SCSS
import "./Room.scss";

const Room = () => {
    const { room, error } = useRoomApi();
    const history = useHistory();

    if (error) return <Error msg={error} goBack={() => history.goBack()} />;
    if (!room) return null;

    return (
        <div className="room">
            <div>{room.name}</div>
            <div>
                {room.users.map((user, index) => (
                    <div key={index}>{user.username}</div>
                ))}
            </div>
            <button onClick={() => history.goBack()}>LEAVE ROOM</button>
        </div>
    );
};

const useRoomApi = () => {
    const [room, setRoom] = useState(null);
    const [error, setError] = useState("");
    const { id } = useParams();

    useEffect(() => {
        console.log("useEffect");
        const onUpdate = (key, data) => {
            console.log(key, data);

            switch (key) {
                case "joined":
                    setRoom(data);
                    break;
                case "updated":
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

    return { room, error };
};

export default Room;

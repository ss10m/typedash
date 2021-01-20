// Redux
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

// Socket API
import SocketAPI from "core/SocketClient";

// SCSS
import "./Room.scss";
import { useEffect, useState } from "react";

const Room = () => {
    const [room, setRoom] = useState(null);
    const { id } = useParams();
    const history = useHistory();

    useEffect(() => {
        SocketAPI.joinRoom(id, onUpdate);
        return () => SocketAPI.leaveRoom();
    }, [id]);

    const onUpdate = (key, data) => {
        console.log("onUpdate");
        console.log(key, data);

        switch (key) {
            case "joined":
                setRoom(data);
                break;
            case "updated":
                setRoom((room) => ({ ...room, ...data }));
                break;
            case "left":
                history.push("/");
                break;
        }
    };

    console.log(room);
    if (!room) return null;

    return (
        <div className="room">
            <div>{room.name}</div>
            <div>
                {room.users.map((user) => (
                    <p>{user.username}</p>
                ))}
            </div>
            <button onClick={() => SocketAPI.leaveRoom()}>LEAVE ROOM</button>
        </div>
    );
};

export default Room;

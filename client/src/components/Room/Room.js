// Redux
import { useSelector } from "react-redux";

// Socket API
import SocketAPI from "core/SocketClient";

// SCSS
import "./Room.scss";

const Room = () => {
    const room = useSelector((state) => state.room);
    console.log(room);

    const leaveRoom = () => {
        SocketAPI.emit("leave-room");
    };

    return (
        <div className="room">
            <div>{room.name}</div>
            <div>
                {room.users.map((user) => (
                    <p>{user.username}</p>
                ))}
            </div>
            <button onClick={leaveRoom}>LEAVE ROOM</button>
        </div>
    );
};

export default Room;

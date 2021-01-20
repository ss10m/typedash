// Redux
import { useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

// Socket API
import SocketAPI from "core/SocketClient";

// SCSS
import "./Room.scss";
import { useEffect } from "react";

const Room = (props) => {
    const room = useSelector((state) => state.room);
    const { id } = useParams();
    const history = useHistory();
    //console.log(room);

    useEffect(() => {
        console.log("joined room: " + id);

        return () => console.log("left room: " + id);
    }, []);

    /*
    const leaveRoom = () => {
        SocketAPI.emit("leave-room");
    };
    */

    return (
        <div className="room">
            <div>ROOM</div>
            <div>{room && room.name}</div>
            <div>{room && room.users.map((user) => <p>{user.username}</p>)}</div>
            <button onClick={() => history.push("/")}>LEAVE ROOM</button>
        </div>
    );
};

export default Room;

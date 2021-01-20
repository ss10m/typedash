// Libraries & utils
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { useHistory } from "react-router-dom";

// SCSS
import "./Rooms.scss";

// Icons
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";

// Socket API
import SocketAPI from "core/SocketClient";

import keyboard from "./kb.jpg";

const Rooms = () => {
    const height = useSelector((state) => state.windowSize.height);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        SocketAPI.joinLobby();
        return () => SocketAPI.leaveLobby();
    }, []);

    return (
        <div className="rooms" style={{ height: height - 120 }}>
            <div className="lobby">
                <div className="imag">
                    <img className="kb" src={keyboard} alt="keyboard" />
                </div>
                <Navigation filter={filter} setFilter={setFilter} />
                <RoomList filter={filter} />
            </div>
        </div>
    );
};

const Navigation = ({ filter, setFilter }) => {
    return (
        <div className="rooms-nagivation">
            <CreateRoomButton />
            <RefreshButton />
            <Filter filter={filter} setFilter={setFilter} />
        </div>
    );
};

const CreateRoomButton = () => {
    const [isCreating, setIsCreating] = useState(false);
    const history = useHistory();
    const createRoom = () => {
        if (isCreating) return;
        setIsCreating(true);
        const onCreate = (roomId) => {
            history.push(`/room/${roomId}`);
        };
        SocketAPI.createRoom(onCreate);
    };

    return (
        <div className="create-btn" onClick={createRoom}>
            Create Room
        </div>
    );
};

const RefreshButton = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const refresh = () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        SocketAPI.refreshLobby();
        setTimeout(() => {
            setIsRefreshing(false);
        }, 800);
    };

    return (
        <div
            className={classNames("refresh-btn", {
                "refresh-btn-disabled": isRefreshing,
            })}
            onClick={refresh}
        >
            <span
                className={classNames({
                    current: isRefreshing,
                })}
            >
                <FiRefreshCw />
            </span>
        </div>
    );
};

const Filter = ({ filter, setFilter }) => {
    return (
        <div className="input-wrapper">
            <div className="icon">
                <FiSearch />
            </div>
            <input
                className={classNames({
                    rounded: !filter,
                })}
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                spellCheck={false}
                placeholder="Search"
                autoComplete="off"
            />
            {filter && (
                <div className="icon right">
                    <span onClick={() => setFilter("")}>
                        <FaTimes />
                    </span>
                </div>
            )}
        </div>
    );
};

const RoomList = ({ filter }) => {
    const rooms = useSelector((state) => state.rooms);

    const filterRooms = () => {
        if (!filter) return rooms;

        const filtered = filter.toLowerCase().trim();

        return rooms.filter((room) => {
            const lowerName = room.name.toLowerCase();
            if (lowerName.includes(filtered)) return true;
            if (lowerName.includes("room " + filtered)) return true;
            return false;
        });
    };

    const filteredRooms = filterRooms();
    // const filteredRooms = [
    //     { name: "ROOM A", id: "asdv32dsg" },
    //     { name: "ROOM B", id: "243wdvas" },
    //     { name: "ROOM C", id: "hkfgh64" },
    // ];

    return (
        <div className="rooms-list">
            {filteredRooms.map((room) => (
                <Room key={room.id} room={room} />
            ))}
        </div>
    );
};

const Room = ({ room }) => {
    const history = useHistory();

    return (
        <div className="room">
            {room.name}
            <button onClick={() => history.push(`/room/${room.id}`)}>JOIN</button>
        </div>
    );
};

// Up for(Online), name, number of users, join btn

export default Rooms;

// Libraries & utils
import React, { useState } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";

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
    const createRoom = () => {
        SocketAPI.emit("create-room");
    };

    return (
        <div className="rooms-nagivation">
            <div className="create-btn" onClick={createRoom}>
                Create Room
            </div>
            <RefreshButton />
            <Filter filter={filter} setFilter={setFilter} />
        </div>
    );
};

const RefreshButton = () => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const refresh = () => {
        if (isRefreshing) return;
        setIsRefreshing(true);
        SocketAPI.emit("get-rooms");
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

    return (
        <div className="rooms-list">
            {filteredRooms.map((room) => (
                <Room key={room.id} room={room} />
            ))}
        </div>
    );
};

const Room = ({ room }) => {
    const joinRoom = () => {
        SocketAPI.emit("join-room", room.id);
    };

    return (
        <div className="room">
            {room.name}
            <button onClick={joinRoom}>JOIN</button>
        </div>
    );
};

// Up for(Online), name, number of users, join btn

export default Rooms;

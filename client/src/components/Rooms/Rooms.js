// Libraries & utils
import React, { useState, useEffect, useRef } from "react";
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
    const [filter, setFilter] = useState("");
    const [marginBottom, setMarginBottom] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const containerHeight = containerRef.current.clientHeight;
        //const rowCount = Math.floor(containerHeight / 40);
        setMarginBottom(containerHeight % 40);
    }, []);

    const resetFilter = () => setFilter("");

    return (
        <div className="rooms" style={{ marginBottom }}>
            <img src={keyboard} alt="keyboard" />
            <Navigation filter={filter} setFilter={setFilter} />
            <div className="header">
                <div className="name">NAME</div>
                <div className="currentStatus">STATUS</div>
                <div className="number">#</div>
                <div className="uptime">UPTIME</div>
                <div className="join"></div>
            </div>
            <div className="results-wrapper" ref={containerRef}>
                <div className="results">
                    <RoomList filter={filter} resetFilter={resetFilter} />
                </div>
            </div>
        </div>
    );
};

const Navigation = ({ filter, setFilter }) => {
    return (
        <div className="nagivation">
            <CreateRoomButton />
            <RefreshButton />
            <Filter filter={filter} setFilter={setFilter} />
        </div>
    );
};

const CreateRoomButton = () => {
    const [isCreating, setIsCreating] = useState(false);
    const history = useHistory();

    useEffect(() => {
        const socket = SocketAPI.getSocket();
        socket.on("room-created", (roomId) => {
            history.push(`/room/${roomId}`);
        });

        return () => {
            socket.off("room-created");
        };
    }, [history]);

    const createRoom = () => {
        if (isCreating) return;
        setIsCreating(true);
        SocketAPI.createRoom();
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

const RoomList = ({ filter, resetFilter }) => {
    const [rooms, setRooms] = useState([]);
    const [time, setTime] = useState(null);

    useEffect(() => {
        const socket = SocketAPI.getSocket();
        socket.on("rooms", (rooms) => {
            console.log("ROOMS");
            console.log(rooms);
            setRooms(rooms);
        });

        SocketAPI.joinLobby();

        let id = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(id);
            socket.off("rooms");
            SocketAPI.leaveLobby();
        };
    }, []);

    const filterMatch = filter.toLowerCase().trim();
    let filteredRooms = rooms;
    if (filterMatch) {
        filteredRooms = rooms.filter((room) => {
            const lowerName = room.name.toLowerCase();
            if (lowerName.includes(filterMatch)) return true;
            if (lowerName.includes("room " + filterMatch)) return true;
            return false;
        });
    }

    if (!filteredRooms.length) {
        return (
            <div className="empty">
                <p>No rooms found</p>
                {filter && (
                    <div className="reset" onClick={resetFilter}>
                        Reset Filter
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="results">
            {filteredRooms.map((room) => (
                <Room key={room.id} room={room} time={time} />
            ))}
        </div>
    );
};

const Room = ({ room, time }) => {
    const history = useHistory();

    const upTime = calcUptime(room.startTime, time);

    return (
        <div className="room">
            <div className="name">{room.name}</div>
            <div className="currentStatus">
                <span>{"PLAYING"}</span>
            </div>
            <div className="users">{room.users}</div>
            <div className="uptime">{`${upTime.minutes}:${upTime.seconds}`}</div>
            <div className="join">
                <button onClick={() => history.push(`/room/${room.id}`)}>JOIN</button>
            </div>
        </div>
    );
};

const calcUptime = (startTime, currentTime) => {
    const time = currentTime - new Date(startTime);

    let seconds = Math.floor((time / 1000) % 60),
        minutes = Math.floor(time / (1000 * 60));

    if (seconds < 0) {
        return {
            minutes: "00",
            seconds: "00",
        };
    }

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return {
        seconds,
        minutes,
    };
};

export default Rooms;

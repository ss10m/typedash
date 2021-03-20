// Libraries & utils
import React, { useState, useEffect } from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";

// Socket API
import SocketAPI from "core/SocketClient";

// Helpers
import { calcUptime } from "helpers";

// Icons
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import { FaTimes, FaUser } from "react-icons/fa";

// Images
import keyboard from "./kb.jpg";

// SCSS
import "./Rooms.scss";

const Rooms = () => {
    const [loaded, setLoaded] = useState(false);
    const [filter, setFilter] = useState("");
    const resetFilter = () => setFilter("");

    useEffect(() => {
        const image = new window.Image();
        image.src = keyboard;
        image.onload = () => {
            setLoaded(true);
        };
    }, []);

    if (!loaded) return null;

    return (
        <div className="rooms">
            <img src={keyboard} alt="keyboard" />
            <Navigation filter={filter} setFilter={setFilter} />
            <div className="header">
                <div className="name">NAME</div>
                <div className="currentStatus">STATUS</div>
                <div className="number">
                    <span>
                        <FaUser />
                    </span>
                </div>
                <div className="uptime">UPTIME</div>
                <div className="join"></div>
            </div>
            <div className="results-wrapper">
                <div className="results">
                    <RoomList filter={filter} resetFilter={resetFilter} />
                </div>
            </div>
            <div className="rooms-footer"></div>
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
                <span className={classNames({ playing: room.isPlaying })}>
                    {room.isPlaying ? "PLAYING" : "WAITING"}
                </span>
            </div>
            <div className="users">{room.users}</div>
            <div className="uptime">{`${upTime.minutes}:${upTime.seconds}`}</div>
            <div className="join">
                <button onClick={() => history.push(`/room/${room.id}`)}>JOIN</button>
            </div>
        </div>
    );
};

export default Rooms;

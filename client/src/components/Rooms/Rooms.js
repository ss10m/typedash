// Libraries & utils
import React, { useState, useEffect } from "react";
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

// Styles
import * as Styled from "./styles";

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
        <Styled.Rooms>
            <Styled.Banner src={keyboard} alt="keyboard" />
            <Navigation filter={filter} setFilter={setFilter} />
            <Styled.Header>
                <Styled.NameHeader>NAME</Styled.NameHeader>
                <Styled.StatusHeader>STATUS</Styled.StatusHeader>
                <Styled.CountHeader>
                    <span>
                        <FaUser />
                    </span>
                </Styled.CountHeader>
                <Styled.UptimeHeader>UPTIME</Styled.UptimeHeader>
                <Styled.JoinHeader />
            </Styled.Header>
            <Styled.Results>
                <div>
                    <RoomList filter={filter} resetFilter={resetFilter} />
                </div>
            </Styled.Results>
            <Styled.Footer />
        </Styled.Rooms>
    );
};

const Navigation = ({ filter, setFilter }) => {
    return (
        <Styled.Navigation>
            <CreateRoomButton />
            <RefreshButton />
            <Filter filter={filter} setFilter={setFilter} />
        </Styled.Navigation>
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

    return <Styled.CreateButton onClick={createRoom}>Create Room</Styled.CreateButton>;
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
        <Styled.RefreshButton onClick={refresh} $disabled={isRefreshing}>
            <span>
                <FiRefreshCw />
            </span>
        </Styled.RefreshButton>
    );
};

const Filter = ({ filter, setFilter }) => {
    return (
        <Styled.Filter>
            <Styled.Icon>
                <FiSearch />
            </Styled.Icon>
            <Styled.Input
                $rounded={!filter}
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                spellCheck={false}
                placeholder="Search"
                autoComplete="off"
            />
            {filter && (
                <Styled.Icon $right={filter}>
                    <span onClick={() => setFilter("")}>
                        <FaTimes />
                    </span>
                </Styled.Icon>
            )}
        </Styled.Filter>
    );
};

const RoomList = ({ filter, resetFilter }) => {
    const [rooms, setRooms] = useState([]);
    const [time, setTime] = useState(new Date());

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
            const partialMatch = lowerName.includes(filterMatch);
            const fullMatch = lowerName.includes("room " + filterMatch);
            return partialMatch || fullMatch;
        });
    }

    if (!filteredRooms.length) {
        return (
            <Styled.EmptyList>
                <p>No rooms found</p>
                {filter && (
                    <Styled.ResetButton onClick={resetFilter}>Reset Filter</Styled.ResetButton>
                )}
            </Styled.EmptyList>
        );
    }

    return filteredRooms.map((room) => <Room key={room.id} room={room} time={time} />);
};

const Room = ({ room, time }) => {
    const history = useHistory();
    const upTime = calcUptime(room.startTime, time);

    return (
        <Styled.Room>
            <Styled.NameValue>{room.name}</Styled.NameValue>
            <Styled.StatusValue $playing={room.isPlaying}>
                <span>{room.isPlaying ? "PLAYING" : "WAITING"}</span>
            </Styled.StatusValue>
            <Styled.CountValue>{room.users}</Styled.CountValue>
            <Styled.UptimeValue>{`${upTime.minutes}:${upTime.seconds}`}</Styled.UptimeValue>
            <Styled.JoinValue>
                <button onClick={() => history.push(`/room/${room.id}`)}>JOIN</button>
            </Styled.JoinValue>
        </Styled.Room>
    );
};

export default Rooms;

// Libraries & utils
import React from "react";
import classNames from "classnames";

// SCSS
import "./Rooms.scss";

// Icons
import { IconContext } from "react-icons";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import { FaPlay, FaPause, FaStop, FaUser, FaTimes } from "react-icons/fa";

import keyboard from "./kb.jpg";

const Rooms = (props) => {
    const {
        windowSize: { height },
    } = props;

    return (
        <div className="rooms" style={{ height: height - 120 }}>
            <div className="rooms-inside">
                <Lobby {...props} />
            </div>
        </div>
    );
};

function Lobby(props) {
    return (
        <div className="lobby">
            <div className="imag">
                <img className="kb" src={keyboard} alt="keyboard" />
            </div>
            <Navigation {...props} />
            <CustomTable {...props} />
        </div>
    );
}

function Navigation(props) {
    return (
        <div className="rooms-nagivation">
            <div className="create-btn" onClick={props.createRoom}>
                Create Room
            </div>
            <div
                className={classNames("refresh-btn", {
                    "refresh-btn-disabled": props.refreshDisabled,
                })}
                onClick={props.refreshRooms}
            >
                <span
                    className={classNames({
                        current: props.refreshDisabled,
                    })}
                >
                    <FiRefreshCw />
                </span>
            </div>

            <div className="input-wrapper">
                <div className="icon">
                    <FiSearch />
                </div>
                <input
                    className={classNames({
                        rounded: !props.filter,
                    })}
                    type="text"
                    value={props.filter}
                    onChange={props.handleChange}
                    spellCheck={false}
                    placeholder="Search"
                    autoComplete="off"
                />
                {props.filter && (
                    <div className="icon right">
                        <span onClick={props.clearFilter}>
                            <FaTimes />
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

function CustomTable(props) {
    const columns = [
        {
            Header: "Status",
            accessor: "indicator",
        },
        {
            Header: "Name",
            accessor: "name",
        },
        {
            Header: <FaUser />,
            accessor: "users",
        },
        {
            Header: "",
            accessor: "join",
        },
    ];

    for (let room of props.rooms) {
        room.indicator = <RoomIndicator status={room.status} isEmpty={props.isEmpty} />;
        room.join = () => props.joinRoom(room.id);
    }

    return (
        <div className="table-wrapper">
            <Table columns={columns} data={props.rooms} refresh={props.refreshRooms} />
            {props.isEmpty(props.rooms) && <div className="empty">No rooms found</div>}
        </div>
    );
}

const RoomIndicator = ({ status, isEmpty }) => {
    if (isEmpty(status)) {
        return (
            <IconContext.Provider value={{ color: "red", size: "20px" }}>
                <FaStop />
            </IconContext.Provider>
        );
    }
    if (status.isPlaying) {
        return (
            <IconContext.Provider value={{ color: "green", size: "20px" }}>
                <FaPlay />
            </IconContext.Provider>
        );
    } else {
        return (
            <IconContext.Provider value={{ color: "orange", size: "20px" }}>
                <FaPause />
            </IconContext.Provider>
        );
    }
};

function Table({ columns, data }) {
    // Up for(Online), name, number of users, join btn
    return null;
}

export default Rooms;

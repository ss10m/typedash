// Libraries & utils
import React from "react";
import classnames from "classnames";

// Componments
import Tooltip from "components/Tooltip/Tooltip";

// Icons
import { FaChevronLeft, FaEye } from "react-icons/fa";

// SCSS
import "./Navigation.scss";

const Navigation = (props) => {
    const extended = window.innerWidth > 600;

    return (
        <div className="navigation">
            <LeaveButton leaveRoom={props.leaveRoom} extended={extended} />
            <div className="room-name">{props.roomName}</div>
            <Spectators extended={extended} />
        </div>
    );
};

const LeaveButton = ({ leaveRoom, extended }) => {
    return (
        <Tooltip msg="LEAVE ROOM" placement="right" visible={!extended}>
            <div className={classnames("button", { extended })} onClick={leaveRoom}>
                <span>
                    <FaChevronLeft />
                </span>
                {extended && "LEAVE ROOM"}
            </div>
        </Tooltip>
    );
};

const Spectators = ({ extended }) => {
    return (
        <Tooltip msg="VIEW SPECTATORS" placement="left" visible={!extended}>
            <div className={classnames("button", { extended })}>
                <span>
                    <FaEye />
                </span>
                {extended && "SPECTATORS"}
            </div>
        </Tooltip>
    );
};

export default Navigation;

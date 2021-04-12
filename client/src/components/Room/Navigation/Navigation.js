// Libraries & utils
import React from "react";
import classnames from "classnames";

// Hooks
import { useWindowSize } from "hooks";

// Icons
import { FaChevronLeft, FaEye } from "react-icons/fa";

// Componments
import Tooltip from "components/Tooltip/Tooltip";

// SCSS
import "./Navigation.scss";

const Navigation = (props) => {
    const { width } = useWindowSize();
    const extended = width > 600;

    return (
        <div className="navigation">
            <LeaveButton leaveRoom={props.leaveRoom} extended={extended} />
            <div className="room-name">{props.roomName}</div>
            <Spectators extended={extended} setViewSpectators={props.setViewSpectators} />
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

const Spectators = ({ extended, setViewSpectators }) => {
    return (
        <Tooltip msg="VIEW SPECTATORS" placement="left" visible={!extended}>
            <div
                className={classnames("button", { extended })}
                onClick={() => setViewSpectators(true)}
            >
                <span>
                    <FaEye />
                </span>
                {extended && "SPECTATORS"}
            </div>
        </Tooltip>
    );
};

export default Navigation;

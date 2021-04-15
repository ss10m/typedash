// Libraries & utils
import React, { useState, useEffect, useRef } from "react";
import classnames from "classnames";

// Icons
import { FaChevronLeft, FaEye } from "react-icons/fa";

// Componments
import Tooltip from "components/Tooltip/Tooltip";

// SCSS
import "./Navigation.scss";

const Navigation = (props) => {
    const [isExtended, setIsExtended] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current) return;
            setIsExtended(containerRef.current.clientWidth > 550);
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="navigation" ref={containerRef}>
            <LeaveButton leaveRoom={props.leaveRoom} extended={isExtended} />
            <div className="room-name">{props.roomName}</div>
            <Spectators extended={isExtended} setViewSpectators={props.setViewSpectators} />
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

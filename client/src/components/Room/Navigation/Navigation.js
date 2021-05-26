// Libraries & utils
import React, { useState, useEffect, useRef } from "react";

// Icons
import { FaChevronLeft, FaEye } from "react-icons/fa";

// Componments
import Tooltip from "components/Tooltip/Tooltip";

// Styles
import * as Styled from "./styles";

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
        <Styled.Navigation ref={containerRef}>
            <LeaveButton leaveRoom={props.leaveRoom} extended={isExtended} />
            <Styled.RoomName>{props.roomName}</Styled.RoomName>
            <Spectators extended={isExtended} setViewSpectators={props.setViewSpectators} />
        </Styled.Navigation>
    );
};

const LeaveButton = ({ leaveRoom, extended }) => {
    return (
        <Tooltip msg="LEAVE ROOM" placement="right" visible={!extended}>
            <Styled.Button onClick={leaveRoom} $extended={extended}>
                <span>
                    <FaChevronLeft />
                </span>
                {extended && "LEAVE ROOM"}
            </Styled.Button>
        </Tooltip>
    );
};

const Spectators = ({ extended, setViewSpectators }) => {
    return (
        <Tooltip msg="VIEW SPECTATORS" placement="left" visible={!extended}>
            <Styled.Button onClick={() => setViewSpectators(true)} $extended={extended}>
                <span>
                    <FaEye />
                </span>
                {extended && "SPECTATORS"}
            </Styled.Button>
        </Tooltip>
    );
};

export default Navigation;

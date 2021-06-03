// Libraries & utils
import React, { useState, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

// Context
import { useRoomContext, setViewSpectators } from "../context";

// Icons
import { FaChevronLeft, FaEye } from "react-icons/fa";

// Componments
import Tooltip from "components/Tooltip/Tooltip";

// Styles
import * as Styled from "./styles";

const Navigation = () => {
    const [isExtended, setIsExtended] = useState(false);
    const containerRef = useRef(null);
    const history = useHistory();

    const { data, dispatch } = useRoomContext();

    const viewSpectators = () => {
        setViewSpectators(dispatch, true);
    };

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
            <LeaveButton leaveRoom={() => history.push("")} extended={isExtended} />
            <Styled.RoomName>{data.room.name}</Styled.RoomName>
            <Spectators extended={isExtended} viewSpectators={viewSpectators} />
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

const Spectators = ({ extended, viewSpectators }) => {
    return (
        <Tooltip msg="VIEW SPECTATORS" placement="left" visible={!extended}>
            <Styled.Button onClick={viewSpectators} $extended={extended}>
                <span>
                    <FaEye />
                </span>
                {extended && "SPECTATORS"}
            </Styled.Button>
        </Tooltip>
    );
};

export default Navigation;

// Libraries & utils
import React, { forwardRef, useEffect } from "react";

// Context
import { useRoomContext, setViewSpectators } from "../context";

// Icons
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Components
import withClickWatcher from "components/withClickWatcher/withClickWatcher";

// Styles
import * as Styled from "./styles";

const Spectators = (props) => {
    return <Inside {...props} />;
};

const Inside = withClickWatcher(
    forwardRef((props, ref) => {
        const { isVisible } = props;
        const { data, dispatch } = useRoomContext();

        useEffect(() => {
            if (!isVisible) setViewSpectators(dispatch, false);
        }, [isVisible, dispatch]);

        return (
            <Styled.Spectators ref={ref}>
                <ListHeader />
                <List spectators={data.spectators} />
            </Styled.Spectators>
        );
    })
);

const ListHeader = () => {
    return (
        <Styled.Header>
            <Styled.Username>USERNAME</Styled.Username>
            <Styled.Status>PLAY NEXT</Styled.Status>
        </Styled.Header>
    );
};

const List = ({ spectators }) => {
    return (
        <Styled.SpectatorList $empty={!spectators.length}>
            {spectators.length ? (
                spectators.map((spectator) => (
                    <Spectator key={spectator.socketId} spectator={spectator} />
                ))
            ) : (
                <p>NO ACTIVE SPECTATORS</p>
            )}
        </Styled.SpectatorList>
    );
};

const Spectator = ({ spectator }) => {
    return (
        <Styled.Spectator>
            <Styled.UsernameValue>{spectator.username}</Styled.UsernameValue>
            <Styled.StatusValue $playNext={spectator.playNext}>
                {spectator.playNext ? <FaCheckCircle /> : <FaTimesCircle />}
            </Styled.StatusValue>
        </Styled.Spectator>
    );
};

export default Spectators;

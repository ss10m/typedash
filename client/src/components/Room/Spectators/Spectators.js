// Libraries & utils
import React, { forwardRef, useEffect } from "react";
import classnames from "classnames";
import withClickWatcher from "components/Modal/Modal";

// Icons
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// SCSS
import "./Spectators.scss";

const Spectators = (props) => {
    return <Inside {...props} />;
};

const Inside = withClickWatcher(
    forwardRef((props, ref) => {
        const { spectators, isVisible, setIsVisible } = props;

        useEffect(() => {
            if (!isVisible) setIsVisible();
        }, [isVisible, setIsVisible]);

        return (
            <div className="spectators" ref={ref}>
                <ListHeader />
                <List spectators={spectators} />
            </div>
        );
    })
);

const ListHeader = () => {
    return (
        <div className="list-header">
            <div className="username">USERNAME</div>
            <div className="next">PLAY NEXT</div>
        </div>
    );
};

const List = ({ spectators }) => {
    if (!spectators.length) {
        return (
            <div className="list">
                <div className="empty">NO ACTIVE SPECTATORS</div>
            </div>
        );
    }

    return (
        <div className="list">
            {spectators.map((spectator) => (
                <Spectator key={spectator.socketId} spectator={spectator} />
            ))}
        </div>
    );
};

const Spectator = ({ spectator }) => {
    return (
        <div className="spectator">
            <div className="username">{spectator.username}</div>
            <div
                className={classnames("status", {
                    play: spectator.playNext,
                })}
            >
                {spectator.playNext ? <FaCheckCircle /> : <FaTimesCircle />}
            </div>
        </div>
    );
};

export default Spectators;

// Libraries & utils
import { useState, useEffect } from "react";
import Switch from "react-switch";

// Constants
import { STATE } from "helpers/constants";

// SCSS
import "./Status.scss";

const Status = ({ state, isSpectating, playNext, toggleSpectate, togglePlayNext }) => {
    if (state.current === STATE.PREGAME || state.current === STATE.COUNTDOWN) {
        return <InstantToggle isSpectating={isSpectating} toggleSpectate={toggleSpectate} />;
    }

    if (isSpectating) {
        return <QueueToggle playNext={playNext} togglePlayNext={togglePlayNext} />;
    }

    return <div>WPM: 88</div>;
};

const InstantToggle = ({ isSpectating, toggleSpectate }) => {
    const [isToggleDisabled, setIsToggleDisabled] = useState(false);

    useEffect(() => {
        setIsToggleDisabled(false);
    }, [isSpectating]);

    const toggle = () => {
        if (isToggleDisabled) return;
        setIsToggleDisabled(true);
        toggleSpectate();
    };

    return <button onClick={toggle}>{isSpectating ? "PLAY" : "SPECTATE"}</button>;
};

const QueueToggle = ({ playNext, togglePlayNext }) => {
    const [isToggleDisabled, setIsToggleDisabled] = useState(false);

    useEffect(() => {
        setIsToggleDisabled(false);
    }, [playNext]);

    const toggle = () => {
        if (isToggleDisabled) return;
        setIsToggleDisabled(true);
        togglePlayNext();
    };

    return (
        <label>
            <span>PLAY NEXT ROUND</span>
            <Switch onChange={toggle} checked={playNext} />
        </label>
    );
};

export default Status;

// Libraries & utils
import { useState, useEffect } from "react";

// Constants
import { STATE } from "helpers/constants";

const Status = ({ state, isSpectating, toggleSpectate, togglePlayNext }) => {
    if (state.current === STATE.PREGAME || state.current === STATE.COUNTDOWN) {
        return <InstantToggle isSpectating={isSpectating} toggleSpectate={toggleSpectate} />;
    }

    if (isSpectating) {
        return <QueueToggle />;
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

const QueueToggle = () => {
    // const [queuedToPlay, setQueuedToPlay] = useState(false);
    // const [isToggleDisabled, setIsToggleDisabled] = useState(false);
    // const toggleQueuedToPlay = () => {
    //     if (isToggleDisabled) return;
    //     setIsToggleDisabled(true);
    //     const toggled = !queuedToPlay;
    //     setQueuedToPlay(toggled);
    //     togglePlayNext(toggled);
    //     setTimeout(() => {
    //         setIsToggleDisabled(false);
    //     }, 1000);
    // };
    // return (
    //     <button onClick={toggleQueuedToPlay} disabled={isToggleDisabled}>
    //         {queuedToPlay ? "PLAYING NEXT" : "NOT PLAYING NEXT"}
    //     </button>
    // );
};

export default Status;

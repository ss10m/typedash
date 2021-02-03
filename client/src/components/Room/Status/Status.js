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

    // const [isChecked, setIsChecked] = useState(false);
    // const [isDisabled, setIsDisabled] = useState(false);

    // const handleChange = () => {
    //     if (isDisabled) return;
    //     console.log("CHANGE");
    //     setIsDisabled(true);
    //     setIsChecked((val) => !val);

    //     setTimeout(() => {
    //         setIsDisabled(false);
    //     }, 1000);
    // };

    console.log(playNext);
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

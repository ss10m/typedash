// Libraries & utils
import { useState, useEffect } from "react";
import Switch from "react-switch";

// Constants
import { STATE } from "helpers/constants";

// SCSS
import "./Spectating.scss";

const Spectating = (props) => {
    return (
        <div className="spectating">
            <div>YOU ARE SPECTATING</div>
            <ToggleSpectate {...props} />
        </div>
    );
};

const ToggleSpectate = ({ state, setSpectate, playNext, setPlayNext }) => {
    if (state.current === STATE.PREGAME || state.current === STATE.COUNTDOWN) {
        return <button onClick={() => setSpectate(false)}>PLAY</button>;
    }
    return <QueueToggle playNext={playNext} setPlayNext={setPlayNext} />;
};

const QueueToggle = ({ playNext, setPlayNext }) => {
    const [isToggleDisabled, setIsToggleDisabled] = useState(false);

    useEffect(() => {
        setIsToggleDisabled(false);
    }, [playNext]);

    const toggle = () => {
        if (isToggleDisabled) return;
        setIsToggleDisabled(true);
        setPlayNext(!playNext);
    };

    return (
        <label>
            <span>PLAY NEXT ROUND</span>
            <Switch onChange={toggle} checked={playNext} />
        </label>
    );
};

export default Spectating;

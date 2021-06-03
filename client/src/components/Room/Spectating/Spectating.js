// Libraries & utils
import { useState, useEffect } from "react";
import Switch from "react-switch";

// Context
import { useRoomContext } from "../context";

// Constants
import { STATE } from "helpers/constants";

// Styles
import * as Styled from "./styles";

const Spectating = (props) => {
    return (
        <Styled.Spectating>
            <p>YOU ARE SPECTATING</p>
            <ToggleSpectate {...props} />
        </Styled.Spectating>
    );
};

const ToggleSpectate = ({ setSpectate, setPlayNext }) => {
    const { data } = useRoomContext();
    const { state, playNext } = data;

    if (state.current === STATE.PREGAME || state.current === STATE.COUNTDOWN) {
        return <Styled.Button onClick={() => setSpectate(false)}>PLAY</Styled.Button>;
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
        <Styled.Label>
            <span>PLAY NEXT ROUND</span>
            <Switch onChange={toggle} checked={playNext} />
        </Styled.Label>
    );
};

export default Spectating;

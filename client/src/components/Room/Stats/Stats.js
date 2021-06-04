// Libraries & utils
import React, { useState, useEffect } from "react";
import Switch from "react-switch";
import useInterval from "./useInterval";

// Context
import { useRoomContext } from "../context";

// Constants
import { STATE } from "helpers/constants";

// Components
import Tooltip from "components/Tooltip/Tooltip";

// Styles
import * as Styled from "./styles";

const Stats = ({ setReady }) => {
    const [active, setActive] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [timer, setTimer] = useState(0);
    const [stopwatch, setStopwatch] = useState(0);

    const { data } = useRoomContext();
    const { state, completed, isRunning, isSpectating, isReady, stats } = data;

    const isPlaying = isRunning && !isSpectating;

    useEffect(() => {
        switch (state.current) {
            case STATE.PREGAME:
                setStartTime(null);
                setTimer(60000);
                setStopwatch(0);
                setActive(false);
                break;
            case STATE.COUNTDOWN:
                setStartTime(null);
                setTimer(60000);
                setStopwatch(0);
                setActive(false);
                break;
            case STATE.PLAYING:
                setStartTime(new Date() - (60000 - state.timer));
                setActive(true);
                break;
            case STATE.POSTGAME:
                setTimer(0);
                setActive(false);
                break;
            default:
                break;
        }
    }, [state]);

    useEffect(() => {
        if (state.current !== STATE.POSTGAME || isSpectating || completed) return;
        setStopwatch(60000);
    }, [state, isSpectating, completed]);

    useInterval(
        () => {
            const timeDiff = new Date() - startTime;
            setTimer(60000 - timeDiff);
            if (isPlaying) setStopwatch(timeDiff);
        },
        active ? 100 : null
    );

    const showReadyUp = !isSpectating && state.current !== STATE.PLAYING;

    return (
        <Styled.Stats>
            <Details stats={stats} stopwatch={stopwatch} />
            {showReadyUp && <ReadyUp state={state} isReady={isReady} setReady={setReady} />}
            <Tooltip msg="TIME LEFT" placement="left" visible={true}>
                <Timer timer={timer} />
            </Tooltip>
        </Styled.Stats>
    );
};

const Details = ({ stats, stopwatch }) => {
    return (
        <Styled.Details>
            <Tooltip msg="WORDS PER MINUTE" placement="bottom-start" visible={true}>
                <Styled.Column $width={55}>
                    <Styled.Title>WPM</Styled.Title>
                    <Styled.Value>{stats.wpm}</Styled.Value>
                </Styled.Column>
            </Tooltip>
            <Styled.Divider />
            <Styled.Column $width={80}>
                <Styled.Title>ACCURACY</Styled.Title>
                <Styled.Value>{Math.round(stats.accuracy) + "%"}</Styled.Value>
            </Styled.Column>
            <Styled.Divider />
            <Styled.Column $width={75}>
                <Styled.Title>TIMER</Styled.Title>
                <Styled.Value>{convertTime(stopwatch)}</Styled.Value>
            </Styled.Column>
        </Styled.Details>
    );
};

const ReadyUp = ({ isReady, setReady }) => {
    const [isToggleDisabled, setIsToggleDisabled] = useState(false);

    useEffect(() => {
        setIsToggleDisabled(false);
    }, [isReady]);

    const toggle = () => {
        if (isToggleDisabled) return;
        setIsToggleDisabled(true);
        setReady(!isReady);
    };

    return (
        <Styled.ReadySwitch>
            <span>READY</span>
            <Switch onChange={toggle} checked={isReady} />
        </Styled.ReadySwitch>
    );
};

const Timer = ({ timer }) => {
    return (
        <Styled.Timer>
            <p>{convertTime(timer)}</p>
        </Styled.Timer>
    );
};

const convertTime = (time) => {
    let seconds = Math.floor((time / 1000) % 60);
    let minutes = Math.floor(time / (1000 * 60));

    seconds = Math.max(0, seconds);
    minutes = Math.max(0, minutes);

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return `${minutes}:${seconds}`;
};

export default Stats;

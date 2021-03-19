// Libraries & utils
import React, { useState, useEffect } from "react";
import Switch from "react-switch";
import useInterval from "./useInterval";

// Constants
import { calcUptime } from "helpers";
import { STATE } from "helpers/constants";

// Components
import Tooltip from "components/Tooltip/Tooltip";

// SCSS
import "./Stats.scss";

const Stats = ({ state, isSpectating, wpm, accuracy, isReady, setReady }) => {
    const [uptime, setUptime] = useState({
        minutes: "00",
        seconds: "00",
    });

    const showReadyUp = !isSpectating && state.current !== STATE.PLAYING;

    return (
        <div className="stats">
            <Details wpm={wpm} accuracy={accuracy} uptime={uptime} />
            {showReadyUp && <ReadyUp state={state} isReady={isReady} setReady={setReady} />}
            <Tooltip msg="TIME LEFT" placement="left" visible={true}>
                <Timer state={state} setUptime={setUptime} />
            </Tooltip>
        </div>
    );
};

const Details = ({ wpm, accuracy, uptime }) => {
    return (
        <div className="details">
            <Tooltip msg="WORDS PER MINUTE" placement="bottom-start" visible={true}>
                <div className="column left">
                    <div className="title">WPM</div>
                    <div className="number">{wpm}</div>
                </div>
            </Tooltip>
            <div className="divider" />
            <div className="column middle">
                <div className="title">ACCURACY</div>
                <div className="number">{Math.round(accuracy) + "%"}</div>
            </div>
            <div className="divider" />
            <div className="column right">
                <div className="title">TIMER</div>
                <div className="number">{`${uptime.minutes}:${uptime.seconds}`}</div>
            </div>
        </div>
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
        setReady(!isReady.current);
    };

    return (
        <label>
            <span>READY</span>
            <Switch onChange={toggle} checked={isReady.current} />
        </label>
    );
};

const Timer = ({ state, setUptime }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [prevTime, setPrevTime] = useState(null);
    const [timeInMilliseconds, setTimeInMilliseconds] = useState(0);
    const [time, setTime] = useState({
        minutes: "00",
        seconds: "00",
    });

    useEffect(() => {
        switch (state.current) {
            case STATE.PREGAME:
                setIsRunning(false);
                setPrevTime(null);
                setTimeInMilliseconds(0);
                setTime({
                    minutes: "02",
                    seconds: "00",
                });
                setUptime({
                    minutes: "00",
                    seconds: "00",
                });
                break;
            case STATE.COUNTDOWN:
                setTime({
                    minutes: "02",
                    seconds: "00",
                });
                setUptime({
                    minutes: "00",
                    seconds: "00",
                });
                break;
            case STATE.PLAYING:
                setStartTime(new Date());
                setTimeInMilliseconds(state.timer);
                setIsRunning(true);
                break;
            case STATE.POSTGAME:
                setIsRunning(false);
                setPrevTime(null);
                setTimeInMilliseconds(0);
                setTime({
                    minutes: "00",
                    seconds: "00",
                });
                break;
            default:
                break;
        }
    }, [state, setUptime]);

    useInterval(
        () => {
            setUptime(calcUptime(startTime, new Date()));
            let prev = prevTime ? prevTime : Date.now();
            let diffTime = Date.now() - prev;
            let newMilliTime = timeInMilliseconds - diffTime;
            let newTime = toTime(newMilliTime);
            if (!newTime) return setIsRunning(false);
            setPrevTime(Date.now());
            setTimeInMilliseconds(newMilliTime);
            setTime(newTime);
        },
        isRunning ? 100 : null
    );

    const toTime = (time) => {
        let seconds = Math.floor((time / 1000) % 60),
            minutes = Math.floor(time / (1000 * 60));

        if (seconds < 0) {
            setTime({
                minutes: "00",
                seconds: "00",
            });
            return false;
        }

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        return {
            seconds,
            minutes,
        };
    };

    return (
        <div className="timer">
            <p>{`${time.minutes}:${time.seconds}`}</p>
        </div>
    );
};

export default Stats;

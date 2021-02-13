// Libraries & utils
import React, { useState, useEffect, useRef } from "react";

// Constants
import { STATE } from "helpers/constants";

const Timer = ({ state }) => {
    const [isRunning, setIsRunning] = useState(false);
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
                break;
            case STATE.PLAYING:
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
    }, [state]);

    useInterval(
        () => {
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

const useInterval = (callback, delay) => {
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        const tick = () => {
            savedCallback.current();
        };

        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
};

export default Timer;

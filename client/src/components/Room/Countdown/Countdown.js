// Libraries & utils
import { useState, useEffect } from "react";
import CountdownInterval from "core/CountdownInterval";

// SCSS
import "./Countdown.scss";

const Countdown = ({ duration, onCancel }) => {
    const [totalTime, setTotalTime] = useState(0);
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        const durationSeconds = Math.floor(duration / 1000);
        const delay = duration % 1000;

        const onStep = (time) => {
            setTimeLeft(time - 1);
        };

        const countdown = new CountdownInterval(1000, durationSeconds, onStep);

        setTimeout(() => {
            setTotalTime(durationSeconds);
            setTimeLeft(durationSeconds - 1);
            countdown.start();
        }, Math.max(100, delay));

        return () => countdown.clear();
    }, [duration]);

    return (
        <div className="countdown">
            <Circle max={totalTime} remaining={timeLeft} />
            <div className="starting">STARTING IN</div>
            <div className="value">{timeLeft !== null && timeLeft + 1}</div>
            <div className="cancel" onClick={onCancel}>
                CANCEL
            </div>
        </div>
    );
};

const Circle = ({ max, remaining }) => {
    const radius = 95;
    const stroke = "orange";
    const strokeWidth = 10;
    const size = (radius + strokeWidth) * 2;
    const length = Math.ceil(2 * radius * Math.PI);
    const remainingLength = Math.min(
        length - Math.ceil(2 * radius * Math.PI) * (remaining / max),
        length
    );

    return (
        <svg
            className="circle"
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <g>
                <circle
                    r={radius}
                    cx={radius + strokeWidth}
                    cy={radius + strokeWidth}
                    stroke="rgba(0, 0, 0, 0.8)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <circle
                    className="indicator"
                    r={radius}
                    cx={radius + strokeWidth}
                    cy={radius + strokeWidth}
                    stroke={stroke}
                    strokeDasharray={length}
                    strokeDashoffset={remainingLength}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
            </g>
        </svg>
    );
};

export default Countdown;
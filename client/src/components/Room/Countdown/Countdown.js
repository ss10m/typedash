// Libraries & utils
import { useState, useEffect } from "react";
import CountdownInterval from "core/CountdownInterval";

// Styles
import * as Styled from "./styles";

const Countdown = ({ duration, isSpectating, onCancel }) => {
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
        <Styled.Countdown>
            <Circle max={totalTime} remaining={timeLeft} />
            <Styled.Header>STARTING IN</Styled.Header>
            <Styled.Count>{timeLeft !== null && timeLeft + 1}</Styled.Count>
            {!isSpectating && (
                <Styled.CancelButton onClick={() => onCancel(false)}>
                    CANCEL
                </Styled.CancelButton>
            )}
        </Styled.Countdown>
    );
};

const Circle = ({ max, remaining }) => {
    const radius = 95;
    const stroke = "orange";
    const strokeWidth = 10;
    const size = (radius + strokeWidth) * 2;
    const length = Math.ceil(2 * radius * Math.PI);
    const remainingLength =
        Math.min(length - Math.ceil(2 * radius * Math.PI) * (remaining / max), length) || 0;

    return (
        <Styled.Circle
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
                <Styled.Progress
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
        </Styled.Circle>
    );
};

export default Countdown;

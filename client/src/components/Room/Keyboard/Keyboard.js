// Libraries & utils
import { useState, useEffect, useRef } from "react";

// Hooks
import { useEventListener } from "hooks";

import keys from "./keys";

// Styles
import * as Styled from "./styles";

const Keyboard = ({ isRunning, quote, wordIndex, correctLength }) => {
    const [pressed, setPressed] = useState({});
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(null);

    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current) return;
            setContainerWidth(containerRef.current.clientWidth);
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const keyDownHandler = (event) => {
        if (!isRunning) return;
        if (pressed[event.code] && pressed[event.code].pressed) return;
        setPressed((prevState) => ({ ...prevState, [event.code]: { pressed: true } }));

        setTimeout(
            () =>
                setPressed((prevState) => ({
                    ...prevState,
                    [event.code]: { pressed: false },
                })),
            200
        );
    };

    useEventListener("keydown", keyDownHandler);

    //console.log(quote.current[wordIndex]);
    if (quote.current[wordIndex]) {
        console.log(quote.current[wordIndex].charAt(correctLength));
    }

    const width = Math.max(Math.min(containerWidth, 787), 280);
    const scale = width / 787;
    const height = 270 * scale;

    return (
        <Styled.Wrapper
            style={{
                height,
            }}
            ref={containerRef}
        >
            <Styled.Keyboard
                style={{
                    transform: `translate(-50%, -50%) scale(${scale})`,
                }}
            >
                {keys.map((row, rowIndex) => (
                    <Styled.Row key={rowIndex}>
                        {row.map((key, keyIndex) => (
                            <Styled.Key
                                key={keyIndex}
                                $width={key.width}
                                $secondary={key.secondary}
                                $pressed={pressed[key.code] && pressed[key.code].pressed}
                            >
                                {key.secondary && <span>{key.secondary}</span>}
                                {key.display}
                            </Styled.Key>
                        ))}
                    </Styled.Row>
                ))}
            </Styled.Keyboard>
        </Styled.Wrapper>
    );
};

export default Keyboard;

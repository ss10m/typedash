// Libraries & utils
import { useState, useEffect, useRef } from "react";

// Hooks
import { useEventListener } from "hooks";

// Helpers
import keys from "./keys";

// Styles
import * as Styled from "./styles";

const Keyboard = ({ isActive, quote, wordIndex, correctLength, typoLength }) => {
    const [pressed, setPressed] = useState({});
    const [containerWidth, setContainerWidth] = useState(null);
    const containerRef = useRef(null);
    const keyToTimeoutId = useRef({});

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
        if (!isActive) return;
        if (!quote.current || !quote.current.length) return;
        const currentWord = quote.current[wordIndex];
        if (!currentWord) return;
        const char = currentWord.charAt(correctLength);
        if (!char) return;

        if (keyToTimeoutId.current[event.code]) {
            clearTimeout(keyToTimeoutId.current[event.code]);
        }

        let valid = false;
        if (typoLength) {
            valid = event.keyCode === 8;
        } else {
            if (
                event.keyCode === 16 &&
                (char === char.toUpperCase() || `!@#$%^&*()_+{}|:"<>?`.includes(char))
            ) {
                valid = true;
            } else {
                valid = event.key === char;
            }
        }

        setPressed((prevState) => ({
            ...prevState,
            [event.code]: { valid },
        }));

        const id = setTimeout(() => {
            delete keyToTimeoutId.current[event.code];
            setPressed((prevState) => {
                const current = { ...prevState };
                delete current[event.code];
                return current;
            });
        }, 200);

        keyToTimeoutId.current[event.code] = id;
    };

    useEventListener("keydown", keyDownHandler);

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
                                $valid={pressed[key.code] && pressed[key.code].valid}
                                $invalid={pressed[key.code] && !pressed[key.code].valid}
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

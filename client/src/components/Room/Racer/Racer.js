// Libraries & utils
import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";

// Redux
import { useSelector } from "react-redux";

// Helpers
import { longestCommonSubstring } from "helpers";
import keyboard from "./keyboard";

// SCSS
import "./Racer.scss";

const Racer = ({ isRunning, currentQuote, updateStatus }) => {
    const [isActive, setIsActive] = useState(false);
    const [input, setInput] = useState("");
    const [quote, setQuote] = useState([]);
    const [quoteLength, setQuoteLength] = useState(0);
    const [wordIndex, setWordIndex] = useState(0);
    const [correctLength, setCorrectLength] = useState(0);
    const [typoLength, setTypoLength] = useState(0);
    const inputRef = useRef(null);

    useEffect(() => {
        const words = currentQuote.split(" ").map((word) => word + " ");
        const lastIndex = words.length - 1;
        words[lastIndex] = words[lastIndex].trim();

        setQuote(words);
        setQuoteLength(words.length);
        setWordIndex(0);
    }, [currentQuote]);

    useEffect(() => {
        console.log("isRunning changed to: " + isRunning);
        if (isRunning) {
            setIsActive(true);
            setWordIndex(0);
            inputRef.current.focus();
        } else {
            console.log("RESET");
            setIsActive(false);
            setInput("");
            setWordIndex(null);
            setCorrectLength(0);
            setTypoLength(0);
        }
    }, [isRunning]);

    useEffect(() => {
        if (isActive) {
            inputRef.current.focus();
        }
    }, [isActive]);

    const handleChange = (event) => {
        if (!isActive) return;
        const input = event.target.value;
        const currentWord = quote[wordIndex];

        if (!currentWord) return;

        if (currentWord === input) {
            return nextWord();
        } else if (currentWord.startsWith(input)) {
            setInput(input);
            setCorrectLength(input.length);
            setTypoLength(0);
        } else if (currentWord === input.slice(0, currentWord.length)) {
            return nextWord();
        } else {
            const strLen = longestCommonSubstring(currentWord, input);

            setInput(input);
            setCorrectLength(strLen);
            setTypoLength(input.length - strLen);
        }
    };

    const nextWord = () => {
        console.log(wordIndex + 1, quoteLength);

        setInput("");
        setWordIndex(wordIndex + 1);
        setCorrectLength(0);
        setTypoLength(0);

        setIsActive(wordIndex + 1 !== quoteLength);

        updateStatus({ progress: wordIndex + 1 });
    };

    return (
        <div className="race">
            <Quote
                quote={quote}
                wordIndex={wordIndex}
                correctLength={correctLength}
                typoLength={typoLength}
            />
            <Input
                input={input}
                ref={inputRef}
                handleChange={handleChange}
                containsTypo={typoLength > 0}
                isDisabled={wordIndex >= quoteLength || !isActive}
            />
            <Keyboard isActive={isActive} />
        </div>
    );
};

const Input = React.forwardRef((props, ref) => (
    <input
        className={classNames({
            typo: props.containsTypo,
        })}
        ref={ref}
        type="text"
        spellCheck={false}
        placeholder="Type the above text"
        autoComplete="off"
        value={props.input}
        onChange={props.handleChange}
        disabled={props.isDisabled}
        autoFocus={true}
    ></input>
));

const Quote = ({ quote, wordIndex, correctLength, typoLength }) => {
    return (
        <div className="quote">
            {quote.map((word, i) => (
                <Word
                    key={i}
                    word={word}
                    id={i}
                    wordIndex={wordIndex}
                    correctLength={correctLength}
                    typoLength={typoLength}
                />
            ))}
        </div>
    );
};

const Word = ({ word, id, wordIndex, correctLength, typoLength }) => {
    if (id === wordIndex) {
        return [...word].map((letter, i) => (
            <Letter
                key={i}
                letter={letter}
                letterIndex={i}
                correctLength={correctLength}
                typoLength={typoLength}
            />
        ));
    }

    return <span className={classNames({ "word-correct": id < wordIndex })}>{word}</span>;
};

const Letter = ({ letter, letterIndex, correctLength, typoLength }) => {
    let letterClass = "";
    if (letterIndex < correctLength) {
        letterClass = "letter-correct";
    } else if (letterIndex < correctLength + typoLength) {
        letterClass = "letter-typo";
    } else if (letter !== " ") {
        letterClass = "word-current";
    }

    return (
        <span
            className={classNames({
                [letterClass]: letterClass,
                "letter-current": letterIndex === correctLength + typoLength,
            })}
        >
            {letter}
        </span>
    );
};

const Keyboard = ({ isActive }) => {
    const { width } = useSelector((state) => state.windowSize);
    const [pressed, setPressed] = useState({});

    const keyDownHandler = (event) => {
        if (!isActive) return;
        if (pressed[event.code] && pressed[event.code].pressed) return;
        setPressed((prevState) => {
            return { ...prevState, [event.code]: { pressed: true } };
        });

        setTimeout(
            () =>
                setPressed((prevState) => {
                    return { ...prevState, [event.code]: { pressed: false } };
                }),
            200
        );
    };

    useEventListener("keydown", keyDownHandler);

    let newWidth = Math.min(width, 787) - 40;
    newWidth = Math.max(newWidth, 280);
    const scale = newWidth / 787;
    const newHeight = 265 * scale;

    return (
        <div
            className="scaleable-wrapper"
            style={{
                height: newHeight,
            }}
        >
            <div
                className="very-specific-design"
                style={{
                    transform: `translate(-50%, -50%) scale(${scale})`,
                }}
            >
                <div className="keyboard">
                    {keyboard.map((row, rowIndex) => (
                        <div className="row" key={rowIndex}>
                            {row.map((key, keyIndex) => (
                                <div
                                    className={classNames("key", {
                                        [key.class]: key.class,
                                        key__symbols: key.secondary,
                                        pressed:
                                            pressed[key.code] && pressed[key.code].pressed,
                                    })}
                                    key={keyIndex}
                                >
                                    {key.secondary && <span>{key.secondary}</span>}
                                    {key.display}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Racer;

function useEventListener(eventName, handler, element = window) {
    const savedHandler = useRef();

    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        const isSupported = element && element.addEventListener;
        if (!isSupported) return;

        const eventListener = (event) => savedHandler.current(event);
        element.addEventListener(eventName, eventListener);

        return () => {
            element.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element]);
}

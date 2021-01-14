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

const Racer = () => {
    const [input, setInput] = useState("");
    const [quote, setQuote] = useState([]);
    const [quoteLength, setQuoteLength] = useState(0);
    const [wordIndex, setWordIndex] = useState(0);
    const [correctLength, setCorrectLength] = useState(0);
    const [typoLength, setTypoLength] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const inputRef = useRef(null);

    useEffect(() => {
        const b =
            `"I wish it need not have happened in my time," said Frodo. ` +
            `"So do I," said Gandalf, "and so do all who live to see ` +
            `such times. But that is not for them to decide. All we ` +
            `have to decide is what to do with the time that is given ` +
            `us."`;
        const words = b.split(" ").map((word) => word + " ");
        const lastIndex = words.length - 1;
        words[lastIndex] = words[lastIndex].trim();

        setQuote(words);
        setQuoteLength(words.length);

        //setTimeout(() => inputRef.current.focus(), 2000);
    }, []);

    const handleChange = (event) => {
        if (!isRunning) setIsRunning(true);
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
        setIsRunning(wordIndex + 1 !== quoteLength);
    };

    return (
        <div className="race">
            <Timer isRunning={isRunning} />
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
                isDisabled={wordIndex >= quoteLength}
            />
            <Keyboard />
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

const Keyboard = () => {
    const { width } = useSelector((state) => state.windowSize);
    const [pressed, setPressed] = useState({});

    const keyDownHandler = (event) => {
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
                    {keyboard.map((row) => (
                        <div className="row">
                            {row.map((key) => (
                                <div
                                    className={classNames("key", {
                                        [key.class]: key.class,
                                        key__symbols: key.secondary,
                                        pressed:
                                            pressed[key.code] && pressed[key.code].pressed,
                                    })}
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

function Timer(props) {
    const [isRunning, setIsRunning] = useState(props.isRunning);
    const [prevTime, setPrevTime] = useState(null);
    const [timeInMilliseconds, setTimeInMilliseconds] = useState(0);
    const [time, setTime] = useState({
        milliseconds: "000",
        minutes: "00",
        seconds: "00",
    });

    useEffect(() => {
        setIsRunning(props.isRunning);
    }, [props.isRunning]);

    useInterval(
        () => {
            let prev = prevTime ? prevTime : Date.now();
            let diffTime = Date.now() - prev;
            let newMilliTime = timeInMilliseconds + diffTime;
            let newTime = toTime(newMilliTime);
            setPrevTime(Date.now());
            setTimeInMilliseconds(newMilliTime);
            setTime(newTime);
        },
        isRunning ? 11 : null
    );

    const toTime = (time) => {
        let milliseconds = parseInt(time % 1000),
            seconds = Math.floor((time / 1000) % 60),
            minutes = Math.floor(time / (1000 * 60));

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        if (milliseconds < 10) milliseconds = "00" + milliseconds;
        else if (milliseconds < 100) milliseconds = "0" + milliseconds;

        return {
            milliseconds,
            seconds,
            minutes,
        };
    };

    return (
        <div className="timer">
            <p>{`${time.minutes}:${time.seconds}:${time.milliseconds}`}</p>
        </div>
    );
}

function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}

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

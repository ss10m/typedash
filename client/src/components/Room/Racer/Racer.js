// Libraries & utils
import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";

// Redux
import { useSelector } from "react-redux";

// Helpers
import { longestCommonSubstring, roundToFixed } from "helpers";
import { STATE } from "helpers/constants";
import keyboard from "./keyboard";

// Components
import Tooltip from "components/Tooltip/Tooltip";

// SCSS
import "./Racer.scss";

const Racer = ({
    state,
    isRunning,
    isSpectating,
    setIsRunning,
    currentQuote,
    updateStatus,
    setWpm,
    setAccuracy,
    setGraphWpm,
    setGraphAccuracy,
}) => {
    const [input, setInput] = useState("");
    const [quote, setQuote] = useState({
        current: [],
        length: 0,
        author: "",
        source: "",
        stats: {},
    });
    const [wordIndex, setWordIndex] = useState(null);
    const [correctLength, setCorrectLength] = useState(0);
    const [typoLength, setTypoLength] = useState(0);
    const inputRef = useRef(null);
    const wordIndexRef = useRef(0);
    const [startTime, setStartTime] = useState(null);
    const wpmIntervalRef = useRef(null);
    const accuracyRef = useRef({ correct: 0, incorrect: 0 });

    useEffect(() => {
        if (!currentQuote) return;
        const { text, length, author, source, stats } = currentQuote;
        const words = text.split(" ").map((word) => word + " ");
        const lastIndex = length - 1;
        words[lastIndex] = words[lastIndex].trim();
        setQuote({ current: words, length, author, source, stats });
        setWordIndex(0);
        setCorrectLength(0);
        accuracyRef.current = { correct: 0, incorrect: 0 };
        wordIndexRef.current = 0;
        setAccuracy(100);
        setWpm(0);
        setGraphWpm([]);
        setGraphAccuracy([]);
    }, [currentQuote, setWpm, setAccuracy, setGraphWpm, setGraphAccuracy]);

    useEffect(() => {
        if (isRunning) {
            inputRef.current.focus();
            const startTime = new Date();
            setStartTime(startTime);
            wpmIntervalRef.current = setInterval(() => {
                const time = new Date() - startTime;
                const wpm = Math.round(wordIndexRef.current / (time / (1000 * 60)));
                setWpm(wpm);
            }, 1000);
        } else {
            setInput("");
            setTypoLength(0);
            clearInterval(wpmIntervalRef.current);
        }
    }, [isRunning, setWpm]);

    const handleChange = (event) => {
        if (!isRunning) return;
        const input = event.target.value;
        const currentWord = quote.current[wordIndex];

        if (!currentWord) return;

        if (currentWord === input) {
            updateAccuracy(input.length, null);
            return nextWord();
        } else if (currentWord.startsWith(input)) {
            updateAccuracy(input.length, null);
            setInput(input);
            setCorrectLength(input.length);
            setTypoLength(0);
        } else if (currentWord === input.slice(0, currentWord.length)) {
            updateAccuracy(input.length, null);
            return nextWord();
        } else {
            const strLen = longestCommonSubstring(currentWord, input);
            updateAccuracy(strLen, input.length - strLen);
            setInput(input);
            setCorrectLength(strLen);
            setTypoLength(input.length - strLen);
        }
    };

    const updateAccuracy = (newCorrectLength, newIncorrectLetters) => {
        const { correct, incorrect } = accuracyRef.current;

        if (newCorrectLength > correctLength && newIncorrectLetters > typoLength) {
            accuracyRef.current = {
                correct: correct + 1,
                incorrect: incorrect + 1,
            };
        } else if (newCorrectLength > correctLength) {
            accuracyRef.current = {
                correct: correct + 1,
                incorrect,
            };
        } else if (newIncorrectLetters > typoLength) {
            accuracyRef.current = {
                correct,
                incorrect: incorrect + 1,
            };
        }

        const floatAccuracy =
            accuracyRef.current.correct /
            (accuracyRef.current.correct + accuracyRef.current.incorrect);
        const actualAccuracy = roundToFixed(floatAccuracy * 100);
        setAccuracy(actualAccuracy);
    };

    const nextWord = () => {
        const newIndex = wordIndex + 1;
        setInput("");
        setWordIndex(newIndex);
        setCorrectLength(0);
        setTypoLength(0);

        wordIndexRef.current = newIndex;

        const time = Math.max(new Date() - startTime, 800);
        const wpm = Math.round(wordIndexRef.current / (time / (1000 * 60)));
        const progress = Math.ceil((wordIndexRef.current / quote.length) * 100);

        const floatAccuracy =
            accuracyRef.current.correct /
            (accuracyRef.current.correct + accuracyRef.current.incorrect);
        const actualAccuracy = roundToFixed(floatAccuracy * 100);

        setGraphWpm((data) => (wordIndex === 0 ? [[0, wpm]] : [...data, [progress, wpm]]));

        setGraphAccuracy((data) =>
            wordIndex === 0 ? [[0, actualAccuracy]] : [...data, [progress, actualAccuracy]]
        );

        if (newIndex === quote.length) {
            setIsRunning(false);
            clearInterval(wpmIntervalRef.current);
            setWpm(wpm);
            updateStatus({ progress: newIndex, wpm, time, accuracy: actualAccuracy });
        } else {
            updateStatus({ progress: newIndex });
        }
    };

    return (
        <div className="race">
            <Quote
                isRunning={isRunning}
                quote={quote}
                wordIndex={wordIndex}
                correctLength={correctLength}
                typoLength={typoLength}
            />
            <Input
                ref={inputRef}
                state={state}
                isRunning={isRunning}
                isSpectating={isSpectating}
                input={input}
                handleChange={handleChange}
                containsTypo={typoLength > 0}
                isDisabled={!isRunning}
            />
            <Keyboard isRunning={isRunning} />
        </div>
    );
};

const Input = React.forwardRef((props, ref) => {
    let placeholder = "";
    if (props.isSpectating) {
        placeholder = "You are spectating";
    } else if (!props.isRunning) {
        switch (props.state.current) {
            case STATE.PREGAME:
                placeholder = "Waiting for players to ready up";
                break;
            case STATE.COUNTDOWN:
                placeholder = "Starting soon...";
                break;
            case STATE.PLAYING:
                placeholder = "Waiting for players to finish";
                break;
            case STATE.POSTGAME:
                placeholder = "Waiting for players to ready up";
                break;
            default:
                placeholder = "Type the above text";
                break;
        }
    }

    return (
        <input
            className={classNames({
                typo: props.containsTypo,
            })}
            ref={ref}
            type="text"
            spellCheck={false}
            placeholder={placeholder}
            autoComplete="off"
            value={props.input}
            onChange={props.handleChange}
            disabled={props.isDisabled}
        ></input>
    );
});

const Quote = ({ isRunning, quote, wordIndex, correctLength, typoLength }) => {
    return (
        <div className="quote">
            <div className="words">
                {quote.current.map((word, i) => (
                    <Word
                        key={i}
                        isRunning={isRunning}
                        word={word}
                        id={i}
                        wordIndex={wordIndex}
                        correctLength={correctLength}
                        typoLength={typoLength}
                    />
                ))}
            </div>
            <div className="quote-stats">
                <div>
                    <Tooltip msg="ALL TIME PLAY COUNT" placement="bottom-start" visible={true}>
                        <div className="item">
                            <div className="header">COUNT</div>
                            <div className="value">{quote.stats.count}</div>
                        </div>
                    </Tooltip>
                    <div className="divider" />
                    <Tooltip msg="AVERAGE WORDS PER MINUTE" placement="bottom" visible={true}>
                        <div className="item">
                            <div className="header">AVG WPM</div>
                            <div className="value">{roundToFixed(quote.stats.avg_wpm)}</div>
                        </div>
                    </Tooltip>
                    <div className="divider" />
                    <Tooltip msg="AVERAGE ACCURACY" placement="bottom" visible={true}>
                        <div className="item">
                            <div className="header">AVG ACC</div>
                            <div className="value">{`${roundToFixed(
                                quote.stats.avg_acc
                            )}%`}</div>
                        </div>
                    </Tooltip>
                </div>
                <div>
                    <div className="item">
                        <div className="header">AUTHOR</div>
                        <div className="value">{quote.author}</div>
                    </div>
                    <div className="divider" />
                    <div className="item">
                        <div className="header">BOOK</div>
                        <div className="value">{quote.source}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Word = ({ isRunning, word, id, wordIndex, correctLength, typoLength }) => {
    if (id === wordIndex) {
        return [...word].map((letter, i) => (
            <Letter
                key={i}
                isRunning={isRunning}
                letter={letter}
                letterIndex={i}
                correctLength={correctLength}
                typoLength={typoLength}
            />
        ));
    }

    return <span className={classNames({ "word-correct": id < wordIndex })}>{word}</span>;
};

const Letter = ({ isRunning, letter, letterIndex, correctLength, typoLength }) => {
    let letterClass = "";
    if (letterIndex < correctLength) {
        letterClass = "letter-correct";
    } else if (letterIndex < correctLength + typoLength) {
        letterClass = "letter-typo";
    }

    return (
        <span
            className={classNames({
                [letterClass]: letterClass,
                "word-current": isRunning && letter !== " ",
                "letter-current": isRunning && letterIndex === correctLength + typoLength,
            })}
        >
            {letter}
        </span>
    );
};

const Keyboard = ({ isRunning }) => {
    const { width } = useSelector((state) => state.windowSize);
    const [pressed, setPressed] = useState({});

    const keyDownHandler = (event) => {
        if (!isRunning) return;
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

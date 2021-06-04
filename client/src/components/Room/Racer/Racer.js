// Libraries & utils
import React, { useState, useEffect, useRef } from "react";

// Helpers
import { longestCommonSubstring, roundToFixed } from "helpers";
import { STATE } from "helpers/constants";

// Components
import Keyboard from "../Keyboard/Keyboard";
import Tooltip from "components/Tooltip/Tooltip";

import {
    useRoomContext,
    toggleIsRunning,
    setCompleted,
    setGraph,
    clearGraph,
    setStats,
} from "../context";

// Styles
import * as Styled from "./styles";

const Racer = ({ updateStatus }) => {
    const [input, setInput] = useState("");
    const [quoteData, setQuote] = useState({
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

    const { data, dispatch } = useRoomContext();

    const { state, isRunning, isSpectating, quote } = data;

    const isActive = isRunning && !isSpectating;

    useEffect(() => {
        if (!quote) return;
        if (!quote.id) {
            if (quote.stats) {
                setQuote((current) => ({ ...current, stats: quote.stats }));
            }
            return;
        }
        const { text, length, author, source, stats } = quote;
        const words = text.split(" ").map((word) => word + " ");
        const lastIndex = length - 1;
        words[lastIndex] = words[lastIndex].trim();
        setQuote({ current: words, length, author, source, stats });
        setWordIndex(0);
        setCorrectLength(0);
        accuracyRef.current = { correct: 0, incorrect: 0 };
        wordIndexRef.current = 0;
        setCompleted(dispatch, false);
        setStats(dispatch, { wpm: 0, accuracy: 0 });
        clearGraph(dispatch);
    }, [dispatch, quote]);

    useEffect(() => {
        if (isActive) {
            inputRef.current.focus();
            const startTime = new Date();
            setStartTime(startTime);
            wpmIntervalRef.current = setInterval(() => {
                const time = new Date() - startTime;
                const wpm = Math.round(wordIndexRef.current / (time / (1000 * 60)));
                setStats(dispatch, { wpm });
            }, 1000);
        } else {
            setInput("");
            setTypoLength(0);
            clearInterval(wpmIntervalRef.current);
        }
    }, [dispatch, isActive]);

    const handleChange = (event) => {
        if (!isActive) return;
        const input = event.target.value;
        const currentWord = quoteData.current[wordIndex];

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
        setStats(dispatch, { accuracy: actualAccuracy });
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
        const progress = Math.ceil((wordIndexRef.current / quoteData.length) * 100);

        const floatAccuracy =
            accuracyRef.current.correct /
            (accuracyRef.current.correct + accuracyRef.current.incorrect);
        const actualAccuracy = roundToFixed(floatAccuracy * 100);

        const graph = {
            wpm: [wordIndex === 0 ? 0 : progress, wpm],
            accuracy: [wordIndex === 0 ? 0 : progress, actualAccuracy],
        };
        setGraph(dispatch, graph);

        if (newIndex === quoteData.length) {
            setCompleted(dispatch, true);
            toggleIsRunning(dispatch, false);
            clearInterval(wpmIntervalRef.current);
            setStats(dispatch, { wpm });
            updateStatus({ progress: newIndex, wpm, time, accuracy: actualAccuracy });
        } else {
            updateStatus({ progress: newIndex });
        }
    };

    return (
        <>
            <Quote
                isActive={isActive}
                quoteData={quoteData}
                wordIndex={wordIndex}
                correctLength={correctLength}
                typoLength={typoLength}
            />
            <Input
                ref={inputRef}
                state={state}
                isActive={isActive}
                isSpectating={isSpectating}
                input={input}
                handleChange={handleChange}
                containsTypo={typoLength > 0}
                isDisabled={!isActive}
            />
            <Keyboard
                isActive={isActive}
                quote={quoteData}
                wordIndex={wordIndex}
                correctLength={correctLength}
                typoLength={typoLength}
            />
        </>
    );
};

const Input = React.forwardRef((props, ref) => {
    let placeholder = "";
    if (props.isSpectating) {
        placeholder = "You are spectating";
    } else if (!props.isActive) {
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
        <Styled.Input
            $typo={props.containsTypo}
            ref={ref}
            type="text"
            spellCheck={false}
            placeholder={placeholder}
            autoComplete="off"
            value={props.input}
            onChange={props.handleChange}
            disabled={props.isDisabled}
        />
    );
});

const Quote = ({ isActive, quoteData, wordIndex, correctLength, typoLength }) => {
    return (
        <Styled.Quote>
            <Styled.Words>
                {quoteData.current.map((word, i) => (
                    <Word
                        key={i}
                        isActive={isActive}
                        word={word}
                        id={i}
                        wordIndex={wordIndex}
                        correctLength={correctLength}
                        typoLength={typoLength}
                    />
                ))}
            </Styled.Words>
            <Styled.Stats>
                <div>
                    <Tooltip msg="ALL TIME PLAY COUNT" placement="bottom-start" visible={true}>
                        <Styled.Stat>
                            <Styled.Header>COUNT</Styled.Header>
                            <Styled.Value>{quoteData.stats.count}</Styled.Value>
                        </Styled.Stat>
                    </Tooltip>
                    <Styled.Divider />
                    <Tooltip msg="AVERAGE WORDS PER MINUTE" placement="bottom" visible={true}>
                        <Styled.Stat>
                            <Styled.Header>AVG WPM</Styled.Header>
                            <Styled.Value>
                                {roundToFixed(quoteData.stats.avg_wpm)}
                            </Styled.Value>
                        </Styled.Stat>
                    </Tooltip>
                    <Styled.Divider />
                    <Tooltip msg="AVERAGE ACCURACY" placement="bottom" visible={true}>
                        <Styled.Stat>
                            <Styled.Header>AVG ACC</Styled.Header>
                            <Styled.Value>{`${roundToFixed(
                                quoteData.stats.avg_acc
                            )}%`}</Styled.Value>
                        </Styled.Stat>
                    </Tooltip>
                </div>
                <div>
                    <Styled.Stat>
                        <Styled.Header>AUTHOR</Styled.Header>
                        <Styled.Value>{quoteData.author}</Styled.Value>
                    </Styled.Stat>
                    <Styled.Divider />
                    <Styled.Stat>
                        <Styled.Header>BOOK</Styled.Header>
                        <Styled.Value>{quoteData.source}</Styled.Value>
                    </Styled.Stat>
                </div>
            </Styled.Stats>
        </Styled.Quote>
    );
};

const Word = ({ isActive, word, id, wordIndex, correctLength, typoLength }) => {
    if (id === wordIndex) {
        return [...word].map((letter, i) => (
            <Letter
                key={i}
                isActive={isActive}
                letter={letter}
                letterIndex={i}
                correctLength={correctLength}
                typoLength={typoLength}
            />
        ));
    }

    return <Styled.Word $correct={id < wordIndex}>{word}</Styled.Word>;
};

const Letter = ({ isActive, letter, letterIndex, correctLength, typoLength }) => {
    const isCorrect = letterIndex < correctLength;

    return (
        <Styled.Letter
            $current={isActive && letterIndex === correctLength + typoLength}
            $currentWord={isActive && letter !== " "}
            $correct={isCorrect}
            $typo={!isCorrect && letterIndex < correctLength + typoLength}
        >
            {letter}
        </Styled.Letter>
    );
};

export default Racer;

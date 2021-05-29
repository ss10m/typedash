// Libraries & utils
import React, { useState, useEffect, useRef } from "react";

// Helpers
import { longestCommonSubstring, roundToFixed } from "helpers";
import { STATE } from "helpers/constants";

// Components
import Keyboard from "../Keyboard/Keyboard";
import Tooltip from "components/Tooltip/Tooltip";

// Styles
import * as Styled from "./styles";

const Racer = ({
    state,
    isRunning,
    isSpectating,
    setIsRunning,
    currentQuote,
    setCompleted,
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
        if (!currentQuote.id) {
            if (currentQuote.stats) {
                setQuote((current) => ({ ...current, stats: currentQuote.stats }));
            }
            return;
        }
        const { text, length, author, source, stats } = currentQuote;
        const words = text.split(" ").map((word) => word + " ");
        const lastIndex = length - 1;
        words[lastIndex] = words[lastIndex].trim();
        setQuote({ current: words, length, author, source, stats });
        setWordIndex(0);
        setCorrectLength(0);
        accuracyRef.current = { correct: 0, incorrect: 0 };
        wordIndexRef.current = 0;
        setCompleted(false);
        setAccuracy(100);
        setWpm(0);
        setGraphWpm([]);
        setGraphAccuracy([]);
    }, [currentQuote, setCompleted, setWpm, setAccuracy, setGraphWpm, setGraphAccuracy]);

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
            setCompleted(true);
            setIsRunning(false);
            clearInterval(wpmIntervalRef.current);
            setWpm(wpm);
            updateStatus({ progress: newIndex, wpm, time, accuracy: actualAccuracy });
        } else {
            updateStatus({ progress: newIndex });
        }
    };

    return (
        <>
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
            <Keyboard
                isRunning={isRunning}
                quote={quote}
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

const Quote = ({ isRunning, quote, wordIndex, correctLength, typoLength }) => {
    return (
        <Styled.Quote>
            <Styled.Words>
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
            </Styled.Words>
            <Styled.Stats>
                <div>
                    <Tooltip msg="ALL TIME PLAY COUNT" placement="bottom-start" visible={true}>
                        <Styled.Stat>
                            <Styled.Header>COUNT</Styled.Header>
                            <Styled.Value>{quote.stats.count}</Styled.Value>
                        </Styled.Stat>
                    </Tooltip>
                    <Styled.Divider />
                    <Tooltip msg="AVERAGE WORDS PER MINUTE" placement="bottom" visible={true}>
                        <Styled.Stat>
                            <Styled.Header>AVG WPM</Styled.Header>
                            <Styled.Value>{roundToFixed(quote.stats.avg_wpm)}</Styled.Value>
                        </Styled.Stat>
                    </Tooltip>
                    <Styled.Divider />
                    <Tooltip msg="AVERAGE ACCURACY" placement="bottom" visible={true}>
                        <Styled.Stat>
                            <Styled.Header>AVG ACC</Styled.Header>
                            <Styled.Value>{`${roundToFixed(
                                quote.stats.avg_acc
                            )}%`}</Styled.Value>
                        </Styled.Stat>
                    </Tooltip>
                </div>
                <div>
                    <Styled.Stat>
                        <Styled.Header>AUTHOR</Styled.Header>
                        <Styled.Value>{quote.author}</Styled.Value>
                    </Styled.Stat>
                    <Styled.Divider />
                    <Styled.Stat>
                        <Styled.Header>BOOK</Styled.Header>
                        <Styled.Value>{quote.source}</Styled.Value>
                    </Styled.Stat>
                </div>
            </Styled.Stats>
        </Styled.Quote>
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

    return <Styled.Word $correct={id < wordIndex}>{word}</Styled.Word>;
};

const Letter = ({ isRunning, letter, letterIndex, correctLength, typoLength }) => {
    const isCorrect = letterIndex < correctLength;

    return (
        <Styled.Letter
            $current={isRunning && letterIndex === correctLength + typoLength}
            $currentWord={isRunning && letter !== " "}
            $correct={isCorrect}
            $typo={!isCorrect && letterIndex < correctLength + typoLength}
        >
            {letter}
        </Styled.Letter>
    );
};

export default Racer;

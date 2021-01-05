// Libraries & utils
import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";

// Helpers
import { longestCommonSubstring } from "helpers";

// SCSS
import "./Racer.scss";

class Racer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            input: "",
            quote: [],
            quoteLength: 0,
            author: "",
            title: "",
            wordIndex: 0,
            correctLength: 0,
            typoLength: 0,
            isRunning: false,
        };

        this.inputRef = React.createRef();
    }

    componentDidMount() {
        const b =
            `"I wish it need not have happened in my time," said Frodo. ` +
            `"So do I," said Gandalf, "and so do all who live to see ` +
            `such times. But that is not for them to decide. All we ` +
            `have to decide is what to do with the time that is given ` +
            `us."`;
        const words = b.split(" ").map((word) => word + " ");
        const lastIndex = words.length - 1;
        words[lastIndex] = words[lastIndex].trim();
        this.setState(
            {
                quote: words,
                quoteLength: words.length,
                author: "J.R.R. Tolkien",
                title: "The Fellowship of the Ring",
            },
            () => {
                this.inputRef.current.focus();
            }
        );

        /*
        setTimeout(() => {
            this.setState({ isRunning: true });
        }, 2000);
        */
    }

    handleChange = (event) => {
        if (!this.state.isRunning) this.setState({ isRunning: true });
        const input = event.target.value;
        const currentWord = this.state.quote[this.state.wordIndex];

        if (!currentWord) return;

        let updatedState;
        if (currentWord === input) {
            return this.nextWord();
        } else if (currentWord.startsWith(input)) {
            updatedState = {
                input,
                correctLength: input.length,
                typoLength: 0,
            };
        } else if (currentWord === input.slice(0, currentWord.length)) {
            return this.nextWord();
        } else {
            const strLen = longestCommonSubstring(currentWord, input);
            updatedState = {
                input,
                correctLength: strLen,
                typoLength: input.length - strLen,
            };
        }

        this.setState(updatedState);
    };

    nextWord = () => {
        console.log(this.state.wordIndex + 1, this.state.quoteLength);
        this.setState((prevState) => ({
            input: "",
            wordIndex: prevState.wordIndex + 1,
            correctLength: 0,
            typoLength: 0,
            isRunning: prevState.wordIndex + 1 !== prevState.quoteLength,
        }));
    };

    render() {
        return (
            <div className="race">
                <Timer isRunning={this.state.isRunning} />
                <Quote
                    quote={this.state.quote}
                    wordIndex={this.state.wordIndex}
                    correctLength={this.state.correctLength}
                    typoLength={this.state.typoLength}
                />
                <Input
                    input={this.state.input}
                    ref={this.inputRef}
                    handleChange={this.handleChange}
                    containsTypo={this.state.typoLength > 0}
                    isDisabled={this.state.wordIndex >= this.state.quoteLength}
                />
            </div>
        );
    }
}

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

export default Racer;

function Timer(props) {
    const [isRunning, setIsRunning] = useState(props.isRunning);
    const [prevTime, setPrevTime] = useState(null);
    const [timeInMilliseconds, setTimeInMilliseconds] = useState(0);
    const [time, setTime] = useState({ milliseconds: "000", minutes: "00", seconds: "00" });

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

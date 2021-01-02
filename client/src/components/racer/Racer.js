// Libraries & utils
import React from "react";
import classNames from "classnames";

// Redux
import { connect } from "react-redux";
import { getSession, login, logout, loginAsGuest, register } from "store/actions";

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
    }

    handleChange = (event) => {
        const input = event.target.value;
        const currentWord = this.state.quote[this.state.wordIndex];

        if (!currentWord) return;

        let updatedState;
        if (currentWord === input) {
            updatedState = (prevState) => ({
                input: "",
                wordIndex: prevState.wordIndex + 1,
                correctLength: 0,
                typoLength: 0,
            });
        } else if (currentWord.startsWith(input)) {
            updatedState = {
                input,
                correctLength: input.length,
                typoLength: 0,
            };
        } else if (currentWord === input.slice(0, currentWord.length)) {
            updatedState = (prevState) => ({
                input: "",
                wordIndex: prevState.wordIndex + 1,
                correctLength: 0,
                typoLength: 0,
            });
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

    render() {
        return (
            <div className="app">
                <div className="race">
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
        <div className="quote no-select">
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

const mapStateToProps = (state) => {
    return {
        session: state.session,
    };
};

const mapDispatchToProps = (dispatch) => ({
    getSession: () => {
        dispatch(getSession());
    },
    login: () => {
        dispatch(login());
    },
    loginAsGuest: () => {
        dispatch(loginAsGuest());
    },
    register: () => {
        dispatch(register());
    },
    logout: () => {
        dispatch(logout());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Racer);

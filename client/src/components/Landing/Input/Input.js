// Libraries & utils
import { useState, useEffect, useRef } from "react";
import classNames from "classnames";

// Icons
import { FaUser, FaCheckCircle, FaWindowClose } from "react-icons/fa";

// Helpers
import { handleResponse } from "helpers";

// Components
import Spinner from "../../Spinner/Spinner";

// SCSS
import "./Input.scss";

const Input = ({ initialValue, setCurrentInput }) => {
    const [input, setInput] = useState(initialValue.username);
    const [containsError, setContainsError] = useState(!initialValue.valid);
    const [isFetching, setIsFetching] = useState(false);
    const didMountRef = useRef(false);
    const inputRef = useRef(input);
    inputRef.current = input;

    useEffect(() => {
        if (!didMountRef.current) return (didMountRef.current = true);
        if (!input) return;
        setIsFetching(true);
        const handler = setTimeout(() => {
            fetch("/api/session/check", {
                method: "POST",
                body: JSON.stringify({
                    username: input,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(handleResponse)
                .then((res) => {
                    console.log(input, inputRef.current);
                    if (input !== inputRef.current) return;
                    setCurrentInput({ username: input, valid: true });
                    setIsFetching(false);
                })
                .catch(() => {
                    setCurrentInput({ username: input, valid: false });
                    setContainsError(true);
                    setIsFetching(false);
                })
                .finally(() => {});
        }, 1000);

        return () => {
            clearTimeout(handler);
            setIsFetching(false);
        };
    }, [input, setCurrentInput]);

    const handleInputChange = (event) => {
        const username = event.target.value;
        if (!username) {
            setCurrentInput({ username: "", valid: true });
            setIsFetching(false);
        }
        setContainsError(false);
        setInput(username);
    };

    let borderColor = {};
    let status = null;
    if (isFetching) {
        status = <Spinner size={20} />;
    } else if (containsError) {
        status = <FaWindowClose />;
        borderColor.borderColor = "red";
    } else if (input.length) {
        status = <FaCheckCircle />;
    }

    return (
        <div className="landing-input">
            <div className="icon" style={borderColor}>
                <FaUser />
            </div>
            <input
                style={borderColor}
                type="text"
                value={input}
                onChange={handleInputChange}
                spellCheck={false}
                placeholder="Username"
                autoComplete="off"
            />
            <div
                className={classNames("status", {
                    success: !containsError && input.length,
                })}
                style={borderColor}
            >
                {status}
            </div>
        </div>
    );
};

export default Input;

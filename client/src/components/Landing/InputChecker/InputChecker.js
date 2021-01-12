// Libraries & utils
import { useState, useEffect, useRef } from "react";
import classNames from "classnames";

// Icons
import { FaUser, FaAt, FaKey, FaCheckCircle, FaWindowClose } from "react-icons/fa";

// Helpers
import { handleResponse } from "helpers";

// Components
import Spinner from "../../Spinner/Spinner";

// SCSS
import "./InputChecker.scss";

const InputChecker = ({
    type,
    placeholder,
    initialValue,
    setCurrentInput,
    margin,
    confirm,
}) => {
    const [input, setInput] = useState(initialValue.value);
    const [containsError, setContainsError] = useState(!initialValue.valid);
    const [isFetching, setIsFetching] = useState(false);
    const didMountRef = useRef(false);
    const inputRef = useRef(input);
    inputRef.current = input;

    useEffect(() => {
        if (!didMountRef.current) return (didMountRef.current = true);
        if (!input) return;
        setIsFetching(true);
        setCurrentInput((input) => ({ ...input, valid: false }));

        const handler = setTimeout(() => {
            fetch("/api/session/check", {
                method: "POST",
                body: JSON.stringify({
                    type,
                    value: input,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(handleResponse)
                .then((res) => {
                    if (input !== inputRef.current) return;
                    else if (confirm && res.value !== confirm) {
                        setCurrentInput({ value: res.value, valid: false });
                        setContainsError(true);
                        return;
                    }
                    setCurrentInput({ value: res.value, valid: true });
                    setContainsError(false);
                })
                .catch(() => {
                    setCurrentInput({ value: input, valid: false });
                    setContainsError(true);
                })
                .finally(() => {
                    setIsFetching(false);
                });
        }, 1000);

        return () => {
            clearTimeout(handler);
            setIsFetching(false);
        };
    }, [type, input, setCurrentInput, confirm]);

    const handleInputChange = (event) => {
        const username = event.target.value;
        if (!username) {
            setCurrentInput({ value: "", valid: false });
        }
        setContainsError(false);
        setInput(username);
    };

    let borderStyle = {};
    if (containsError && input.length) borderStyle.borderColor = "red";

    return (
        <div className={classNames("landing-input", { margin })}>
            <Icon type={type} borderStyle={borderStyle} />
            <input
                style={borderStyle}
                type={type === "password" ? "password" : "text"}
                value={input}
                onChange={handleInputChange}
                spellCheck={false}
                placeholder={placeholder}
                autoComplete="off"
            />
            <Status
                inputLength={input.length}
                containsError={containsError}
                isFetching={isFetching}
                borderStyle={borderStyle}
            />
        </div>
    );
};

const Icon = ({ type, borderStyle }) => {
    let icon;
    switch (type) {
        case "username":
            icon = <FaUser />;
            break;
        case "email":
            icon = <FaAt />;
            break;
        case "password":
            icon = <FaKey />;
            break;
        default:
            break;
    }
    return (
        <div className="icon" style={borderStyle}>
            {icon}
        </div>
    );
};

const Status = ({ inputLength, containsError, isFetching, borderStyle }) => {
    let status = null;
    if (isFetching) {
        status = <Spinner size={20} />;
    } else if (containsError && inputLength) {
        status = <FaWindowClose />;
    } else if (inputLength) {
        status = <FaCheckCircle />;
    }
    return (
        <div
            className={classNames("status", {
                success: !containsError && inputLength,
            })}
            style={borderStyle}
        >
            {status}
        </div>
    );
};

export default InputChecker;

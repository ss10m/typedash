// Libraries & utils
import Reac, { useState, useEffect } from "react";
import classNames from "classnames";

// Icons
import { FaUser, FaCheckCircle, FaWindowClose } from "react-icons/fa";

// Helpers
import { handleResponse } from "helpers";

// Components
import Spinner from "../../Spinner/Spinner";

// SCSS
import "./Input.scss";

const Input = () => {
    const [input, setInput] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [containsError, setContainsError] = useState(false);

    useEffect(() => {
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
                .then(() => {
                    setIsFetching(false);
                })
                .catch(() => {
                    setIsFetching(false);
                    setContainsError(true);
                });
        }, 500);

        return () => {
            clearTimeout(handler);
            setIsFetching(false);
        };
    }, [input]);

    const handleInputChange = (event) => {
        const username = event.target.value;
        if (containsError) setContainsError(false);
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

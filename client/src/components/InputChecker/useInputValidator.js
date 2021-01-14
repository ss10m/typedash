// Libraries & utils
import { useState, useEffect, useRef } from "react";

// Helpers
import { handleResponse } from "helpers";

const useInputValidator = (type, initialValue, setIsValid) => {
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
        setIsValid((input) => ({ ...input, valid: false }));

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
                    setIsValid({ value: res.value, valid: true });
                    setContainsError(false);
                })
                .catch(() => {
                    setIsValid({ value: input, valid: false });
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
    }, [type, input, setIsValid]);

    return { input, setInput, containsError, setContainsError, isFetching };
};

export default useInputValidator;

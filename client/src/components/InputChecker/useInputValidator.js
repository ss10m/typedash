// Libraries & utils
import { useState, useEffect, useRef } from "react";

// Helpers
import { handleResponse } from "helpers";

const useInputValidator = (type, initial, setIsValid, test) => {
    const [input, setInput] = useState(initial.value);
    const [containsError, setContainsError] = useState(!initial.valid);
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
            fetch("/api/validate", {
                method: "POST",
                body: JSON.stringify({
                    type,
                    test,
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
    }, [type, input, setIsValid, test]);

    return { input, setInput, containsError, setContainsError, isFetching };
};

export default useInputValidator;

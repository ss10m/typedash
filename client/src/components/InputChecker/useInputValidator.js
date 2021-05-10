// Libraries & utils
import { useState, useEffect, useRef } from "react";

// Helpers
import { handleResponse } from "helpers";

const useInputValidator = (type, initial, setIsValid, setIsChecking, test) => {
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
        if (setIsChecking) setIsChecking(true);
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
                .then((response) => {
                    if (!response.ok) return Promise.reject();
                    return response.json();
                })
                .then(({ meta, data }) => {
                    if (!meta.ok) throw new Error();
                    if (input !== inputRef.current) return;
                    setIsValid({ value: data.value, valid: true });
                    setContainsError(false);
                })
                .catch(() => {
                    setIsValid({ value: input, valid: false });
                    setContainsError(true);
                })
                .finally(() => {
                    setIsFetching(false);
                    if (setIsChecking) setIsChecking(false);
                });
        }, 1000);

        return () => {
            clearTimeout(handler);
            setIsFetching(false);
            if (setIsChecking) setIsChecking(false);
        };
    }, [type, input, setIsValid, setIsChecking, test]);

    return { input, setInput, containsError, setContainsError, isFetching };
};

export default useInputValidator;

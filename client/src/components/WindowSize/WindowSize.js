// Libraries & utils
import { useRef, useEffect, useCallback } from "react";

// Redux
import { useDispatch } from "react-redux";
import { updateWindowSize } from "store/actions";

const WindowSize = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateWindowSize(window.innerWidth));
    }, [dispatch]);

    const handler = useCallback(() => {
        dispatch(updateWindowSize(window.innerWidth));
    }, [dispatch]);

    useEventListener("resize", handler);
    return null;
};

function useEventListener(eventName, handler, element = window) {
    const savedHandler = useRef();

    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        const isSupported = element && element.addEventListener;
        if (!isSupported) return;

        const eventListener = (event) => savedHandler.current(event);
        element.addEventListener(eventName, eventListener);

        return () => {
            element.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element]);
}

export default WindowSize;

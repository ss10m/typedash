// Libraries & utils
import { useEffect, useCallback } from "react";

// Redux
import { useDispatch } from "react-redux";
import { updateWindowSize } from "store/actions";

// Hooks
import { useEventListener } from "hooks";

const WindowSize = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateWindowSize(window.innerWidth, window.innerHeight));
    }, [dispatch]);

    const handler = useCallback(() => {
        dispatch(updateWindowSize(window.innerWidth, window.innerHeight));
    }, [dispatch]);

    useEventListener("resize", handler);
    return null;
};

export default WindowSize;

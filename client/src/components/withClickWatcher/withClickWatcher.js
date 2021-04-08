// Libraries & utils
import { useState, useRef, useCallback } from "react";

// Hooks
import { useEventListener } from "hooks";

const withClickWatcher = (Component) => (props) => {
    const [isVisible, setIsVisible] = useState(true);
    const ref = useRef(null);

    const handler = useCallback((event) => {
        if (!ref.current || ref.current.contains(event.target)) {
            return;
        }
        setIsVisible(false);
    }, []);

    useEventListener("click", handler);

    return <Component {...props} ref={ref} isVisible={isVisible} />;
};

export default withClickWatcher;

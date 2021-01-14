// Libraries & utils
import { useState, useEffect, useRef, useCallback } from "react";

const withClickWatcher = (Component) => (props) => {
    const [isVisible, setIsVisible] = useState(true);
    const ref = useRef(null);

    const handler = useCallback((event) => {
        //console.log(ref, ref.current, ref.current.contains(event.target));

        // if (!ref || !ref.current || !ref.current.contains(event.target)) {
        //     console.log("on outside click");
        //     setIsVisible(false);
        // }

        if (!ref.current || ref.current.contains(event.target)) {
            return;
        }

        setIsVisible(false);
    }, []);

    useEventListener("click", handler);

    return <Component {...props} ref={ref} isVisible={isVisible} />;
};
export default withClickWatcher;

// const UserOptionsContainer = ({ onOutsideClick }) => {
//     const dropdownRef = useRef(null);

//     const handler = useCallback(
//         (event) => {
//             if (
//                 !dropdownRef ||
//                 !dropdownRef.current ||
//                 !dropdownRef.current.contains(event.target)
//             ) {
//                 onOutsideClick();
//             }
//         },
//         [onOutsideClick]
//     );

//     useEventListener("click", handler);

//     return React.cloneElement(this.props.children, { ref: dropdownRef });
// };

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

// export default UserOptionsContainer;

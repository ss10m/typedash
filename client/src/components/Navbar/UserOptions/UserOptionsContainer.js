// Libraries & utils
import { useEffect, useRef, useCallback } from "react";

// Redux
import { useSelector, useDispatch } from "react-redux";
import { logout } from "store/actions";

// Components
import UserOptions from "./UserOptions";

// Helpers
//import { dateDifference } from "helpers";

const UserOptionsContainer = ({ toggleDropDown, setDropdown }) => {
    const dispatch = useDispatch();
    const dropdownRef = useRef(null);

    const handler = useCallback(
        (event) => {
            if (
                !dropdownRef ||
                !dropdownRef.current ||
                !dropdownRef.current.contains(event.target)
            ) {
                toggleDropDown(event);
            }
        },
        [toggleDropDown]
    );

    useEventListener("click", handler);

    const closeDropdown = () => {
        setDropdown(false);
    };

    const logout2 = () => {
        setDropdown(false);
        dispatch(logout());
    };

    const username = useSelector((state) => state.session.user.username);

    return (
        <UserOptions
            ref={dropdownRef}
            username={username}
            loggedIn={325}
            closeDropdown={closeDropdown}
            logout={logout2}
        />
    );
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

export default UserOptionsContainer;

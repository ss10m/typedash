// Libraries & utils
import React, { forwardRef, useEffect } from "react";
import { withRouter } from "react-router-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { logout, showClaimAccount } from "store/actions";

// Icons
import {
    FaUserCircle,
    FaChartBar,
    FaRegCopy,
    FaUnlockAlt,
    FaRegUser,
    FaSignOutAlt,
} from "react-icons/fa";

import withClickWatcher from "../../Modal/Modal";

import { ACCOUNT_TYPE } from "helpers/constants";

// SCSS
import "./UserOptions.scss";

const UserOptions = withClickWatcher(
    forwardRef((props, ref) => {
        const { hideUserOptions, isVisible } = props;
        const { username, accountType } = useSelector((state) => state.session.user);

        useEffect(() => {
            if (!isVisible) hideUserOptions();
        }, [isVisible, hideUserOptions]);

        const handleLogout = () => {
            props.history.push("");
            return logout();
        };

        return (
            <div className="dropdown-options" ref={ref}>
                <Header username={username} loggedIn={"235235"} />
                <hr className="divider" />
                <Button
                    icon={<FaChartBar />}
                    name="PROFILE"
                    hideUserOptions={hideUserOptions}
                />
                {accountType === ACCOUNT_TYPE.GUEST ? (
                    <Button
                        icon={<FaRegCopy />}
                        name="CLAIM ACCOUNT"
                        onClick={showClaimAccount}
                        hideUserOptions={hideUserOptions}
                    />
                ) : (
                    <>
                        <Button
                            icon={<FaRegUser />}
                            name="CHANGE USERNAME"
                            hideUserOptions={hideUserOptions}
                        />
                        <Button
                            icon={<FaUnlockAlt />}
                            name="CHANGE PASSWORD"
                            hideUserOptions={hideUserOptions}
                        />
                    </>
                )}
                <hr className="divider" />
                <Button
                    icon={<FaSignOutAlt />}
                    name="LOGOUT"
                    onClick={handleLogout}
                    hideUserOptions={hideUserOptions}
                />
            </div>
        );
    })
);

const Header = ({ username, loggedIn }) => {
    return (
        <div className="dropdown-header">
            <div className="info">
                <span className="icon">
                    <FaUserCircle />
                </span>
                <div className="details">
                    <p className="username">{username}</p>
                    <p className="last-login">Expires in: {loggedIn}</p>
                </div>
            </div>
        </div>
    );
};

const Button = ({ icon, name, onClick, hideUserOptions }) => {
    const dispatch = useDispatch();
    const onButtonClick = () => {
        if (onClick) dispatch(onClick());
        hideUserOptions();
    };

    return (
        <div className="dropdown-option">
            <div className="option" onClick={onButtonClick}>
                <span className="icon">{icon}</span>
                {name}
            </div>
        </div>
    );
};

export default withRouter(UserOptions);

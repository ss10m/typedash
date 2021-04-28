// Libraries & utils
import React, { forwardRef, useEffect } from "react";
import { withRouter } from "react-router-dom";
import moment from "moment";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { logout } from "store/actions";

// Icons
import { FaUserCircle, FaBirthdayCake, FaRegCopy, FaCog, FaSignOutAlt } from "react-icons/fa";

// Constants
import { ACCOUNT_TYPE } from "helpers/constants";

// Components
import withClickWatcher from "components/withClickWatcher/withClickWatcher";

// Styles
import * as Styles from "./styles.js";

const Dropdown = withClickWatcher(
    forwardRef((props, ref) => {
        const { isVisible, hideDropdown, showSettings, showClaimAccount } = props;
        const { user } = useSelector((state) => state.session);
        const dispatch = useDispatch();

        useEffect(() => {
            if (!isVisible) hideDropdown();
        }, [isVisible, hideDropdown]);

        const handleLogout = () => {
            props.history.push("");
            dispatch(logout());
        };

        return (
            <Styles.Dropdown ref={ref}>
                <Header user={user} />
                <Styles.Divider />
                {user.accountType === ACCOUNT_TYPE.GUEST ? (
                    <Button
                        icon={FaRegCopy}
                        text="Claim Account"
                        onClick={showClaimAccount}
                        hideDropdown={hideDropdown}
                    />
                ) : (
                    <Button
                        icon={FaCog}
                        text="Settings"
                        onClick={showSettings}
                        hideDropdown={hideDropdown}
                    />
                )}
                <Styles.Divider />
                <Button
                    icon={FaSignOutAlt}
                    text="Logout"
                    onClick={handleLogout}
                    hideDropdown={hideDropdown}
                />
            </Styles.Dropdown>
        );
    })
);

const Header = ({ user }) => {
    return (
        <Styles.Header>
            <Styles.UserInfo $username>
                <Styles.Icon $header>
                    <FaUserCircle />
                </Styles.Icon>
                <div>
                    <p>{user.displayName}</p>
                </div>
            </Styles.UserInfo>
            <Styles.UserInfo>
                <Styles.Icon>
                    <FaBirthdayCake />
                </Styles.Icon>
                <div>
                    <p>{moment(user.createdAt).format("MMM Do, YYYY")}</p>
                </div>
            </Styles.UserInfo>
        </Styles.Header>
    );
};

const Button = (props) => {
    const { icon, text, onClick, hideDropdown } = props;
    const Icon = icon;

    const handleClick = () => {
        onClick();
        hideDropdown();
    };

    return (
        <Styles.Button onClick={handleClick}>
            <Styles.Icon $option>
                <Icon />
            </Styles.Icon>
            {text}
        </Styles.Button>
    );
};

export default withRouter(Dropdown);

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
import * as Styled from "./styles.js";

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
            <Styled.Dropdown ref={ref}>
                <Header user={user} />
                <Styled.Divider />
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
                <Styled.Divider />
                <Button
                    icon={FaSignOutAlt}
                    text="Logout"
                    onClick={handleLogout}
                    hideDropdown={hideDropdown}
                />
            </Styled.Dropdown>
        );
    })
);

const Header = ({ user }) => {
    return (
        <Styled.Header>
            <Styled.UserInfo $username>
                <Styled.Icon $header>
                    <FaUserCircle />
                </Styled.Icon>
                <div>
                    <p>{user.displayName}</p>
                </div>
            </Styled.UserInfo>
            <Styled.UserInfo>
                <Styled.Icon>
                    <FaBirthdayCake />
                </Styled.Icon>
                <div>
                    <p>{moment(user.createdAt).format("MMM Do, YYYY")}</p>
                </div>
            </Styled.UserInfo>
        </Styled.Header>
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
        <Styled.Button onClick={handleClick}>
            <Styled.Icon $option>
                <Icon />
            </Styled.Icon>
            {text}
        </Styled.Button>
    );
};

export default withRouter(Dropdown);

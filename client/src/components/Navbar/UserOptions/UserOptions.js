// Libraries & utils
import React, { forwardRef } from "react";
import { Link } from "react-router-dom";

// ICONS
import { FaUserCircle, FaChartBar, FaRegCopy, FaSignOutAlt } from "react-icons/fa";

// SCSS
import "./UserOptions.scss";

const UserOptions = forwardRef((props, ref) => {
    let { username, loggedIn, closeDropdown, logout } = props;
    return (
        <div className="dropdown-options" ref={ref}>
            <Header username={username} loggedIn={loggedIn} />
            <hr className="divider" />
            <ReLink
                link="profile"
                icon={<FaChartBar />}
                name="PROFILE"
                closeDropdown={closeDropdown}
            />
            <ReLink
                link="profile"
                icon={<FaRegCopy />}
                name="CLAIM ACCOUNT"
                closeDropdown={closeDropdown}
            />
            <hr className="divider" />
            <Button icon={<FaSignOutAlt />} name="LOGOUT" onClick={logout} />
        </div>
    );
});

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

const ReLink = ({ link, icon, name, closeDropdown }) => {
    return (
        <Link to={link} className="dropdown-option">
            <div className="option" onClick={closeDropdown}>
                <span className="icon">{icon}</span>
                {name}
            </div>
        </Link>
    );
};

const Button = ({ onClick, icon, name }) => {
    return (
        <div className="dropdown-option">
            <div className="option" onClick={onClick}>
                <span className="icon">{icon}</span>
                {name}
            </div>
        </div>
    );
};

export default UserOptions;

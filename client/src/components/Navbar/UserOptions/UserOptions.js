// Libraries & utils
import React from "react";

// SCSS
import "./UserOptions.scss";

const UserOptions = (props) => {
    let { username, loggedIn, showNotifications, toggleNotifications, logout } = props;
    return (
        <div className="dropdown-options">
            <Button icon="cog" name="Settings" />
            <Button icon="globe-americas" name="Language" />
            <hr className="divider" />
            <Button icon="sign-out-alt" name="Log Out" onClick={logout} />
        </div>
    );
};

const Header = ({ username, loggedIn }) => {
    return (
        <div className="dropdown-header">
            <div className="info">
                <p className="username">{username}</p>
            </div>
            <p className="last-login">Logged in: {loggedIn}</p>
        </div>
    );
};

const Button = ({ icon, name, onClick }) => {
    return (
        <div className="dropdown-option">
            <div className="button selectable" onClick={onClick}>
                {name}
            </div>
        </div>
    );
};

export default UserOptions;

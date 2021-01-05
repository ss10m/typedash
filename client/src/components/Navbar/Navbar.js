// Libraries & utils
import React, { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// ICONS
import {
    FaTrophy,
    FaPlay,
    FaChartBar,
    FaUserCircle,
    FaChevronDown,
    FaChevronUp,
} from "react-icons/fa";

// Components
import UserOptions from "./UserOptions/UserOptionsContainer";

//SCSS
import "./Navbar.scss";

function Navbar() {
    const windowSize = useSelector((state) => state.windowSize);

    return (
        <div className="navbar">
            <Logo windowSize={windowSize} />
            <div className="right-side">
                <NavItem windowSize={windowSize} link="battle" name="PLAY">
                    <FaPlay />
                </NavItem>
                <NavItem windowSize={windowSize} link="battle" name="HIGHSCORES">
                    <FaTrophy />
                </NavItem>
                <User windowSize={windowSize} />
            </div>
        </div>
    );
}

const Logo = ({ windowSize }) => {
    let minmized = windowSize < 520;
    return (
        <Link to="/" className="logo">
            {minmized ? "K" : "KEYBOARD"}
            <span>{minmized ? "B" : "BATTLES"}</span>
        </Link>
    );
};

const NavItem = (props) => {
    const { windowSize, link, name } = props;
    return (
        <Link to={`/${link}`} className="item">
            <span className="icon">{props.children}</span>
            {windowSize >= 700 && <span style={{ marginLeft: "7px" }}>{name}</span>}
        </Link>
    );
};

const User = ({ windowSize }) => {
    const [dropdown, setDropdown] = useState(false);
    const user = useSelector((state) => state.session.user);

    const toggleDropDown = useCallback((event) => {
        event.stopPropagation();
        event.preventDefault();
        setDropdown(!dropdown);
    });

    if (!user) {
        return (
            <Link to="/login" className="item login">
                LOGIN
            </Link>
        );
    }
    return (
        <div id="userDropdown">
            <div className="item login" onClick={(e) => toggleDropDown(e)}>
                <span className="icon" style={{ marginRight: "7px" }}>
                    {windowSize < 400 ? <FaUserCircle /> : user.username}
                </span>
                <span className="icon">{dropdown ? <FaChevronUp /> : <FaChevronDown />}</span>
            </div>
            {dropdown && (
                <UserOptions setDropdown={setDropdown} toggleDropDown={toggleDropDown} />
            )}
        </div>
    );
};

export default Navbar;

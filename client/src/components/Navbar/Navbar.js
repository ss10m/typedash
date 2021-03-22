// Libraries & utils
import React, { useState } from "react";
import classnames from "classnames";
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
import UserOptions from "./UserOptions/UserOptions";

//SCSS
import "./Navbar.scss";

const Navbar = () => {
    const { session, windowSize } = useSelector((state) => state);
    const windowWidth = windowSize.width;

    return (
        <div className="navbar">
            <Logo windowWidth={windowWidth} />
            <div className="right-side">
                <NavItem windowWidth={windowWidth} link="" name="PLAY">
                    <FaPlay />
                </NavItem>
                <NavItem windowWidth={windowWidth} link="highscores" name="HIGHSCORES">
                    <FaTrophy />
                </NavItem>
                <NavItem
                    windowWidth={windowWidth}
                    link={`profile/${session.user.username}`}
                    name="PROFILE"
                >
                    <FaChartBar />
                </NavItem>
                <User user={session.user} windowWidth={windowWidth} />
            </div>
        </div>
    );
};

const Logo = ({ windowWidth }) => {
    let minmized = windowWidth < 520;
    return (
        <Link to="/" className="logo">
            {minmized ? "T" : "TYPE"}
            <span>{minmized ? "D" : "DASH"}</span>
        </Link>
    );
};

const NavItem = (props) => {
    const { windowWidth, link, name } = props;
    return (
        <Link to={`/${link}`} className={classnames("item", { mini: windowWidth < 380 })}>
            <span className="icon">{props.children}</span>
            {windowWidth >= 860 && <span style={{ marginLeft: "7px" }}>{name}</span>}
        </Link>
    );
};

const User = ({ user, windowWidth }) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleDropDown = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setIsVisible(!isVisible);
    };

    if (!user) {
        return (
            <Link to="/login" className="item login">
                LOGIN
            </Link>
        );
    }
    return (
        <div id="userDropdown">
            <div
                className={classnames("item login", { mini: windowWidth < 380 })}
                onClick={(e) => toggleDropDown(e)}
            >
                <span className="icon" style={{ marginRight: "7px" }}>
                    {windowWidth < 630 ? <FaUserCircle /> : user.displayName}
                </span>
                <span className="icon">{isVisible ? <FaChevronUp /> : <FaChevronDown />}</span>
            </div>
            {isVisible && <UserOptions hideUserOptions={() => setIsVisible(false)} />}
        </div>
    );
};

export default Navbar;

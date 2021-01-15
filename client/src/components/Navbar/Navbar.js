// Libraries & utils
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// ICONS
import { FaTrophy, FaPlay, FaUserCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";

// Components
import UserOptions from "./UserOptions/UserOptions";

//SCSS
import "./Navbar.scss";

function Navbar() {
    const windowWidth = useSelector((state) => state.windowSize.width);

    return (
        <div className="navbar">
            <Logo windowWidth={windowWidth} />
            <div className="right-side">
                <NavItem windowWidth={windowWidth} link="rooms" name="PLAY">
                    <FaPlay />
                </NavItem>
                <NavItem windowWidth={windowWidth} link="battle" name="HIGHSCORES">
                    <FaTrophy />
                </NavItem>
                <User windowWidth={windowWidth} />
            </div>
        </div>
    );
}

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
        <Link to={`/${link}`} className="item">
            <span className="icon">{props.children}</span>
            {windowWidth >= 700 && <span style={{ marginLeft: "7px" }}>{name}</span>}
        </Link>
    );
};

const User = ({ windowWidth }) => {
    const [isVisible, setIsVisible] = useState(false);
    const user = useSelector((state) => state.session.user);

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
            <div className="item login" onClick={(e) => toggleDropDown(e)}>
                <span className="icon" style={{ marginRight: "7px" }}>
                    {windowWidth < 400 ? <FaUserCircle /> : user.displayName}
                </span>
                <span className="icon">{isVisible ? <FaChevronUp /> : <FaChevronDown />}</span>
            </div>
            {isVisible && <UserOptions hideUserOptions={() => setIsVisible(false)} />}
        </div>
    );
};

export default Navbar;

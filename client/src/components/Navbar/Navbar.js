// Libraries & utils
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { FaTrophy, FaChevronDown } from "react-icons/fa";

//SCSS
import "./Navbar.scss";

function Navbar() {
    const windowSize = useSelector((state) => state.windowSize);

    return (
        <div className="navbar">
            <Logo windowSize={windowSize} />
            <div className="right">
                <Highscores windowSize={windowSize} />
                <User />
            </div>
        </div>
    );
}

function Logo({ windowSize }) {
    return (
        <Link to="/" className="logo">
            {windowSize < 500 ? "K" : "KEYBOARD"}
            <span>{windowSize < 500 ? "B" : "BATTLES"}</span>
        </Link>
    );
}

function Highscores({ windowSize }) {
    return (
        <Link to="/racer" className="item">
            <span className="trophy">
                <FaTrophy />
            </span>
            {windowSize >= 600 && <span style={{ marginLeft: "7px" }}>HIGHSCORES</span>}
        </Link>
    );
}

function User() {
    const user = useSelector((state) => state.session.user);
    if (!user) {
        return (
            <Link to="/login" className="item">
                LOGIN
            </Link>
        );
    }
    return (
        <div className="item">
            <span style={{ marginRight: "7px" }}>{user.username}</span>
            <FaChevronDown />
        </div>
    );
}

export default Navbar;

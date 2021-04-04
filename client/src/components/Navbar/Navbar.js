// Libraries & utils
import React, { useState } from "react";
import classnames from "classnames";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// Icons
import { FaUserCircle, FaChevronDown, FaChevronUp, FaRegChartBar } from "react-icons/fa";
import { GiLaurelsTrophy } from "react-icons/gi";
import { BsChatSquareQuote } from "react-icons/bs";
import { FiPlay } from "react-icons/fi";

// Components
import UserOptions from "./UserOptions/UserOptions";
import Tooltip from "components/Tooltip/Tooltip";

// SCSS
import "./Navbar.scss";

const Navbar = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const { session, windowSize } = useSelector((state) => state);
    const windowWidth = windowSize.width;
    const showTooltip = windowWidth < 860;

    const toggleDropDown = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setShowDropdown(!showDropdown);
    };

    return (
        <div className="navbar" id="userDropdown">
            <Logo windowWidth={windowWidth} />
            <div className="right-side">
                <Tooltip msg="PLAY" placement="bottom" visible={showTooltip} fullHeight>
                    <NavItem windowWidth={windowWidth} link="" name="PLAY">
                        <FiPlay />
                    </NavItem>
                </Tooltip>
                <Tooltip msg="HIGHSCORES" placement="bottom" visible={showTooltip} fullHeight>
                    <NavItem windowWidth={windowWidth} link="highscores" name="HIGHSCORES">
                        <GiLaurelsTrophy />
                    </NavItem>
                </Tooltip>
                <Tooltip msg="QUOTES" placement="bottom" visible={showTooltip} fullHeight>
                    <NavItem windowWidth={windowWidth} link="quotes" name="QUOTES">
                        <BsChatSquareQuote />
                    </NavItem>
                </Tooltip>
                <Tooltip msg="PROFILE" placement="bottom" visible={showTooltip} fullHeight>
                    <NavItem
                        windowWidth={windowWidth}
                        link={`profile/${session.user.username}`}
                        name="PROFILE"
                    >
                        <FaRegChartBar />
                    </NavItem>
                </Tooltip>
                <User
                    user={session.user}
                    windowWidth={windowWidth}
                    showDropdown={showDropdown}
                    toggleDropDown={toggleDropDown}
                />
                {showDropdown && (
                    <UserOptions hideUserOptions={() => setShowDropdown(false)} />
                )}
            </div>
        </div>
    );
};

const Logo = ({ windowWidth }) => {
    let minmized = windowWidth < 550;
    return (
        <Link to="/" className={classnames("logo", { mini: windowWidth < 340 })}>
            {minmized ? "T" : "TYPE"}
            <span>{minmized ? "D" : "DASH"}</span>
        </Link>
    );
};

const NavItem = (props) => {
    const { windowWidth, link, name } = props;
    return (
        <Link to={`/${link}`} className={classnames("item", { mini: windowWidth < 440 })}>
            <span className="icon">{props.children}</span>
            {windowWidth >= 860 && <span style={{ marginLeft: "7px" }}>{name}</span>}
        </Link>
    );
};

const User = ({ user, windowWidth, showDropdown, toggleDropDown }) => {
    if (!user) {
        return (
            <Link to="/login" className="item login">
                LOGIN
            </Link>
        );
    }

    return (
        <>
            <div
                className={classnames("item login", { mini: windowWidth < 440 })}
                onClick={toggleDropDown}
            >
                <span className="icon" style={{ marginRight: "7px" }}>
                    <FaUserCircle />
                </span>
                <span className="icon">
                    {showDropdown ? <FaChevronUp /> : <FaChevronDown />}
                </span>
            </div>
        </>
    );
};

export default Navbar;

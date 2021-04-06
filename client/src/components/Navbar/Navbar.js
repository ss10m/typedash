// Libraries & utils
import React, { useState } from "react";
import classnames from "classnames";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

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
    const [pathname, setPathname] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const { session, windowSize } = useSelector((state) => state);
    const location = useLocation();

    React.useEffect(() => {
        const root = location.pathname.split("/")[1];
        setPathname(root);
    }, [location]);

    const windowWidth = windowSize.width;
    const showTooltip = windowWidth < 865;

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
                    <NavItem
                        windowWidth={windowWidth}
                        link=""
                        name="PLAY"
                        active={pathname === ""}
                    >
                        <FiPlay />
                    </NavItem>
                </Tooltip>
                <Tooltip msg="QUOTES" placement="bottom" visible={showTooltip} fullHeight>
                    <NavItem
                        windowWidth={windowWidth}
                        link="quotes"
                        name="QUOTES"
                        active={pathname === "quotes"}
                    >
                        <BsChatSquareQuote />
                    </NavItem>
                </Tooltip>
                <Tooltip msg="HIGHSCORES" placement="bottom" visible={showTooltip} fullHeight>
                    <NavItem
                        windowWidth={windowWidth}
                        link="highscores"
                        name="HIGHSCORES"
                        active={pathname === "highscores"}
                    >
                        <GiLaurelsTrophy />
                    </NavItem>
                </Tooltip>
                <Tooltip msg="PROFILE" placement="bottom" visible={showTooltip} fullHeight>
                    <NavItem
                        windowWidth={windowWidth}
                        link={`profile/${session.user.username}`}
                        name="PROFILE"
                        active={pathname === "profile"}
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
    let minmized = windowWidth < 570;
    return (
        <Link to="/" className={classnames("logo", { mini: windowWidth < 350 })}>
            {minmized ? "T" : "TYPE"}
            <span>{minmized ? "D" : "DASH"}</span>
        </Link>
    );
};

const NavItem = (props) => {
    const { windowWidth, link, name, active } = props;

    return (
        <Link
            to={`/${link}`}
            className={classnames("item", { mini: windowWidth < 450, active })}
        >
            <span className="icon">{props.children}</span>
            {windowWidth >= 865 && <span style={{ marginLeft: "7px" }}>{name}</span>}
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
                className={classnames("item login", { mini: windowWidth < 450 })}
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

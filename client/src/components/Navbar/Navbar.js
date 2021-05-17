// Libraries & utils
import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

// Icons
import { FaUserCircle, FaChevronDown, FaChevronUp, FaRegChartBar } from "react-icons/fa";
import { GiLaurelsTrophy } from "react-icons/gi";
import { BsChatSquareQuote } from "react-icons/bs";
import { FiPlay } from "react-icons/fi";

// Components
import Dropdown from "./Dropdown/Dropdown";

// Styles
import * as Styled from "./styles";

const Navbar = ({ showSettings, showClaimAccount }) => {
    const [pathname, setPathname] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [containerWidth, setContainerWidth] = useState(null);
    const session = useSelector((state) => state.session);
    const location = useLocation();
    const containerRef = useRef(null);

    React.useEffect(() => {
        const root = location.pathname.split("/")[1];
        setPathname(root);
    }, [location]);

    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current) return;
            setContainerWidth(containerRef.current.clientWidth);
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleDropDown = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setShowDropdown(!showDropdown);
    };

    return (
        <Styled.Navbar ref={containerRef}>
            <Logo width={containerWidth} />
            <NavLinks
                width={containerWidth}
                pathname={pathname}
                session={session}
                showDropdown={showDropdown}
                toggleDropDown={toggleDropDown}
            />
            {showDropdown && (
                <Dropdown
                    hideDropdown={() => setShowDropdown(false)}
                    showSettings={showSettings}
                    showClaimAccount={showClaimAccount}
                />
            )}
        </Styled.Navbar>
    );
};

const Logo = ({ width }) => {
    const initialsOnly = width < 510;
    return (
        <Styled.Logo to="/" $minimized={width < 380}>
            {initialsOnly ? "T" : "TYPE"}
            <span>{initialsOnly ? "D" : "DASH"}</span>
        </Styled.Logo>
    );
};

const NavLinks = (props) => {
    const { width, pathname, session, showDropdown, toggleDropDown } = props;
    return (
        <Styled.NavLinks>
            <NavLink
                width={width}
                link=""
                name="play"
                icon={FiPlay}
                active={pathname === ""}
            />
            <NavLink
                width={width}
                link="/quotes"
                name="quotes"
                icon={BsChatSquareQuote}
                active={pathname === "quotes"}
            />
            <NavLink
                width={width}
                link="/highscores"
                name="highscores"
                icon={GiLaurelsTrophy}
                active={pathname === "highscores"}
            />
            <NavLink
                width={width}
                link={`/profile/${session.user.username}`}
                name="profile"
                icon={FaRegChartBar}
                active={pathname === "profile"}
            />
            <User width={width} showDropdown={showDropdown} toggleDropDown={toggleDropDown} />
        </Styled.NavLinks>
    );
};

const NavLink = (props) => {
    const { width, link, name, icon, active } = props;
    const Icon = icon;
    return (
        <Styled.NavLink to={`${link}`} $active={active} $minimized={width < 390}>
            <Styled.Icon>
                <Icon />
            </Styled.Icon>
            {width >= 810 && <span>{name.toUpperCase()}</span>}
        </Styled.NavLink>
    );
};

const User = ({ width, showDropdown, toggleDropDown }) => {
    return (
        <Styled.User onClick={toggleDropDown} $minimized={width < 380}>
            <Styled.Icon>
                <FaUserCircle />
            </Styled.Icon>
            <Styled.Icon>{showDropdown ? <FaChevronUp /> : <FaChevronDown />}</Styled.Icon>
        </Styled.User>
    );
};

export default Navbar;

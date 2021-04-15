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
import UserOptions from "./UserOptions/UserOptions";

// Styles
import * as Styles from "./styles";

const Navbar = () => {
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
        <Styles.Navbar id="userDropdown" ref={containerRef}>
            <Logo width={containerWidth} />
            <NavLinks
                width={containerWidth}
                pathname={pathname}
                session={session}
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                toggleDropDown={toggleDropDown}
            />
        </Styles.Navbar>
    );
};

const Logo = ({ width }) => {
    const initialsOnly = width < 510;
    return (
        <Styles.Logo to="/" $minimized={width < 380}>
            {initialsOnly ? "T" : "TYPE"}
            <span>{initialsOnly ? "D" : "DASH"}</span>
        </Styles.Logo>
    );
};

const NavLinks = (props) => {
    const { width, pathname, session, showDropdown, setShowDropdown, toggleDropDown } = props;
    return (
        <Styles.NavLinks>
            <NavItem width={width} link="" name="play" active={pathname === ""}>
                <FiPlay />
            </NavItem>
            <NavItem width={width} link="/quotes" name="quotes" active={pathname === "quotes"}>
                <BsChatSquareQuote />
            </NavItem>
            <NavItem
                width={width}
                link="/highscores"
                name="highscores"
                active={pathname === "highscores"}
            >
                <GiLaurelsTrophy />
            </NavItem>
            <NavItem
                width={width}
                link={`/profile/${session.user.username}`}
                name="profile"
                active={pathname === "profile"}
            >
                <FaRegChartBar />
            </NavItem>
            <User width={width} showDropdown={showDropdown} toggleDropDown={toggleDropDown} />
            {showDropdown && <UserOptions hideUserOptions={() => setShowDropdown(false)} />}
        </Styles.NavLinks>
    );
};

const NavItem = (props) => {
    const { children, width, link, name, active } = props;
    return (
        <Styles.NavLink to={`${link}`} $active={active} $minimized={width < 390}>
            <Styles.Icon>{children}</Styles.Icon>
            {width >= 810 && <span>{name.toUpperCase()}</span>}
        </Styles.NavLink>
    );
};

const User = ({ width, showDropdown, toggleDropDown }) => {
    return (
        <Styles.User onClick={toggleDropDown} $minimized={width < 380}>
            <Styles.Icon>
                <FaUserCircle />
            </Styles.Icon>
            <Styles.Icon>{showDropdown ? <FaChevronUp /> : <FaChevronDown />}</Styles.Icon>
        </Styles.User>
    );
};

export default Navbar;

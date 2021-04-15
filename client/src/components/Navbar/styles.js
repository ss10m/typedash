import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

export const Navbar = styled.div`
    height: 50px;
    display: flex;
    margin-bottom: 20px;
    border-radius: 7px;
    box-shadow: 0px 0px 1px 1px black;
    border: 2px solid #3a5068;
    background-color: #2c3f54;
    color: whitesmoke;
`;

export const Logo = styled(Link)`
    line-height: 46px;
    font-size: 28px;
    padding: 0 18px;
    text-decoration: none;
    color: whitesmoke;
    font-weight: 700;

    ${(props) =>
        props.minimized &&
        css`
            font-size: 24px;
            padding: 0 12px;
        `}

    span {
        color: gold;
    }
`;

export const NavLinks = styled.div`
    min-width: 0;
    flex: 1;
    display: flex;
    justify-content: flex-end;
    overflow: hidden;
`;

export const NavLink = styled(Link)`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
    border-left: 3px solid #3a5068;
    font-weight: 600;
    text-decoration: none;
    color: whitesmoke;

    ${(props) =>
        props.active &&
        css`
            background-color: #3a5068;
            pointer-events: none;
        `}

    ${(props) =>
        props.minimized &&
        css`
            flex: 1;
            padding: 0;
        `}

    &:hover {
        cursor: pointer;
        background-color: #3a5068;
    }

    span:nth-of-type(2) {
        margin-left: 7px;
    }
`;

export const Icon = styled.span`
    display: flex;
`;

export const User = styled.div`
    padding: 0 20px;
    display: flex;
    align-items: center;
    border-left: 3px solid #3a5068;

    ${(props) =>
        props.minimized &&
        css`
            padding: 0 10px;
        `}

    &:hover {
        cursor: pointer;
        background-color: #3a5068;
    }

    span:nth-of-type(2) {
        margin-left: 7px;
    }
`;

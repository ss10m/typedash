import styled, { css } from "styled-components";

export const Dropdown = styled.div`
    width: 210px;
    position: absolute;
    top: 54px;
    right: -2px;
    border-radius: 7px;
    background-color: #2c3f54;
    box-shadow: 0px 0px 3px 1px black;
    border: 2px solid #3a5068;
    display: flex;
    flex-direction: column;
    z-index: 10;
`;

export const Header = styled.div`
    display: flex;
    align-items: center;
    margin: 10px 0;
    border-radius: 7px 7px 0 0;
    padding: 8px 20px 1px 20px;
    color: whitesmoke;
`;

export const Icon = styled.span`
    display: flex;

    ${(props) =>
        props.$header &&
        css`
            font-size: 30px;
        `}

    ${(props) =>
        props.$option &&
        css`
            font-size: 18px;
            margin-right: 8px;
        `}
`;

export const UserInfo = styled.div`
    margin-left: 8px;
    width: 150px;

    & > p {
        font-weight: 700;
        font-size: 16px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: gold;
    }

    div {
        display: flex;
        align-items: center;
        margin: 0;
        margin-top: 2px;
        font-size: 14px;
        font-weight: 300;

        p {
            margin-left: 5px;
        }
    }
`;

export const Divider = styled.hr`
    height: 1px;
    margin: 8px 20px;
    border: none;
    opacity: 0.2;
    background-color: white;
    color: white;
`;

export const Button = styled.div`
    height: 35px;
    display: flex;
    align-items: center;
    margin: 0 14px;
    padding: 0 8px;
    border-radius: 5px;
    font-size: 14px;

    &:hover {
        cursor: pointer;
        background-color: #3a5068;
    }

    &:last-child {
        margin-bottom: 8px;
    }
`;

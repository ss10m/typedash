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
    flex-direction: column;
    margin-top: 10px;
    border-radius: 7px 7px 0 0;
    padding: 8px 0 1px 15px;
    color: whitesmoke;
`;

export const UserInfo = styled.div`
    display: flex;
    align-items: center;

    div {
        flex: 1;
        margin: 0 5px;
        overflow: hidden;

        ${(props) =>
            props.$username &&
            css`
                margin-left: 8px;
            `}

        & > p {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            ${(props) =>
                props.$username
                    ? css`
                          font-weight: 900;
                          font-size: 18px;
                      `
                    : css`
                          font-size: 14px;
                      `}
        }
    }

    &:nth-of-type(2) {
        margin-top: 8px;
        margin-left: 7px;

        div {
            margin-left: 10px;
        }
    }
`;

export const Icon = styled.span`
    display: flex;

    ${(props) =>
        props.$header &&
        css`
            font-size: 30px;
            color: darkcyan;
        `}

    ${(props) =>
        props.$option &&
        css`
            font-size: 18px;
            margin-right: 8px;
        `}
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

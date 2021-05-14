import styled, { css } from "styled-components";

export const Wrapper = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Landing = styled.div`
    width: 320px;
    height: 550px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    margin: 10px 0;
    padding: 35px 0;
    border-radius: 5px;
    border: 2px solid #3a5068;
    background-image: linear-gradient(to bottom right, #273747, #273747, #121a21);
    color: whitesmoke;
`;

export const Header = styled.div`
    font-size: 24px;
    font-weight: 700;
    text-align: center;

    p:nth-child(2) {
        font-weight: 800;
        font-size: 45px;

        span {
            color: #debb00;
        }
    }
`;

export const Body = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const ErrorMsg = styled.div`
    margin: 0 10px;
    font-size: 14px;
    color: red;
`;

export const GuestLogin = styled.form`
    width: 260px;

    p {
        margin-left: 10px;
        margin-bottom: 3px;
        font-size: 15px;
    }
`;

export const Button = styled.button`
    width: 100%;
    height: 45px;
    margin-top: 10px;
    border-radius: 7px;
    background-color: #debb00;
    border: none;
    outline: none;
    color: black;
    text-align: center;
    font-size: 20px;
    font-weight: 800;
    transition: all 0.5s;
    box-shadow: 0px 0px 2px 1px #080808;
    cursor: pointer;

    ${(props) =>
        props.$primary &&
        css`
            background-color: #3a5068;
            color: whitesmoke;
        `}

    ${(props) =>
        props.$cancel &&
        css`
            background-color: #ff4e4e;
            color: whitesmoke;
        `}

    ${(props) =>
        props.$disabled &&
        css`
            opacity: 0.4;
            pointer-events: none;
        `}

    span {
        display: inline-block;
        position: relative;
        transition: 0.5s;

        &:after {
            content: "\\00bb";
            position: absolute;
            opacity: 0;
            top: -2px;
            right: -20px;
            transition: 0.5s;
        }
    }

    &:hover span {
        padding-right: 25px;

        &:after {
            opacity: 1;
            right: 0;
        }
    }
`;

export const Navigation = styled.div`
    width: 230px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-weight: 400;
    font-size: 14px;

    div {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &:first-of-type {
            margin-bottom: 10px;
        }
    }

    button {
        margin-left: 10px;
        padding: 5px 5px;
        background-color: #273747;
        box-shadow: 0px 0px 2px 1px #406182;
        outline: none;
        border: none;
        border-radius: 5px;
        color: whitesmoke;

        &:hover {
            cursor: pointer;
            background-color: #406182;
        }
    }
`;

export const Form = styled.form`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

export const InputFields = styled.div`
    width: 260px;
`;

export const Buttons = styled.div`
    width: 260px;
`;

import styled, { css, keyframes } from "styled-components";

const fadeOut = keyframes`
    from {
        background: rgba(0, 0, 0, 0);
    }
    to {
        background: rgba(0, 0, 0, 0.55);
    }
`;

export const Background = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    animation: ${fadeOut} 0.15s ease-in forwards;
`;

export const Wrapper = styled.div`
    min-width: 320px;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Modal = styled.div`
    width: 320px;
    display: flex;
    flex-direction: column;
    margin: 10px;
    padding: 20px;
    border: 2px solid #3a5068;
    border-radius: 7px;
    color: whitesmoke;
    background-color: #203140;
`;

export const Header = styled.div`
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    margin: 20px 0 30px 0;

    div:first-of-type {
        font-weight: 800;
        font-size: 45px;

        span {
            color: #debb00;
        }
    }
`;

export const Body = styled.div`
    height: 340px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    ${(props) =>
        props.$center &&
        css`
            justify-content: center;
            align-items: center;
        `}
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
            opacity: 0.2;
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

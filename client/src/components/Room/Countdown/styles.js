import styled from "styled-components";

export const Countdown = styled.div`
    width: 200px;
    height: 200px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.75);
    border-radius: 50%;
    padding: 5px;
    box-shadow: 0px 0px 3px 1px black;
    z-index: 5;
`;

export const Circle = styled.svg`
    position: absolute;
`;

export const Progress = styled.circle`
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    transition: 1s linear all;
`;

export const Header = styled.div`
    position: absolute;
    top: 35px;
`;

export const Count = styled.div`
    position: absolute;
    font-size: 70px;
`;

export const CancelButton = styled.div`
    position: absolute;
    bottom: 30px;
    background-color: whitesmoke;
    font-size: 12px;
    padding: 2px 5px;
    border-radius: 7px;
    border: 1px solid whitesmoke;
    background-color: black;
    cursor: pointer;
`;

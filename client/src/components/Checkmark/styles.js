import styled, { keyframes } from "styled-components";

const draw = keyframes`
    to {
        stroke-dashoffset: 0;
    }
`;

const scale = keyframes`
    0%,
    100% {
        transform: none;
    }
    50% {
        transform: scale3d(0.9, 0.9, 1);
    }
`;

export const Checkmark = styled.svg`
    display: block;
    height: ${(props) => props.$diameter}px;
    width: ${(props) => props.$diameter}px;
    animation: ${scale} 0.7s forwards 1s;

    g {
        fill: none;
        stroke-width: 2;
        fill-rule: evenodd;
        stroke-linecap: round;
        stroke-linejoin: round;
    }
`;

export const Circle = styled.path`
    stroke-dasharray: 76;
    stroke-dashoffset: 76;
    stroke: green;
    animation: ${draw} 1s forwards;
`;

export const Tick = styled.path`
    stroke-dasharray: 18;
    stroke-dashoffset: 18;
    stroke: whitesmoke;
    animation: ${draw} 0.5s forwards 1s;
`;

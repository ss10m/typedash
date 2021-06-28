import styled, { keyframes } from "styled-components";

export const Spinner = styled.div`
    width: ${(props) => props.$size}px;
    height: ${(props) => props.$size}px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const rotator = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(270deg);
    }
`;

export const Svg = styled.svg`
    width: 100px;
    height: 100px;
    animation: ${rotator} 1.8s linear infinite;
`;

const dash = keyframes`
    0% {
        stroke-dashoffset: 187;
    }
    50% {
        stroke-dashoffset: 46.75;
        transform: rotate(135deg);
    }
    100% {
        stroke-dashoffset: 187;
        transform: rotate(450deg);
    }
`;

export const Circle = styled.circle`
    stroke-dasharray: 187;
    stroke-dashoffset: 0;
    transform-origin: center;
    stroke: whitesmoke;
    animation: ${dash} 1.8s ease-in-out infinite;
`;

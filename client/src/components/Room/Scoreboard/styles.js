import styled, { css } from "styled-components";

export const Scoreboard = styled.div`
    margin-bottom: 20px;
`;

export const Header = styled.div`
    margin-bottom: 7px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 22px;
    font-weight: 800;
`;

export const Button = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2c3f54;
    border-radius: 7px;
    padding: 0 5px;
    box-shadow: 0px 0px 1px 1px #080808;
    border: 2px solid #3a5068;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
`;

export const Scores = styled.div`
    display: flex;
`;

export const StartLine = styled.div`
    width: 25px;
    background-color: #283c4e;
    border: 2px solid #3a5068;
    writing-mode: vertical-rl;
    font-size: 15px;
    font-weight: 700;
    line-height: 21px;
    text-orientation: mixed;
    text-align: center;

    ${(props) =>
        props.$minimized &&
        css`
            font-size: 10px;
        `}
`;

export const Players = styled.div`
    flex: 1;
`;

export const FinishLine = styled.div`
    width: 20px;
    background-image: linear-gradient(45deg, #000000 25%, transparent 25%),
        linear-gradient(-45deg, #000000 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #000000 75%),
        linear-gradient(-45deg, whitesmoke 75%, #000000 75%);
    background-size: 20px 20px;
    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
`;

export const Spectating = styled.div`
    text-align: center;
    font-size: 38px;
    font-weight: 900;

    span {
        text-align: left;
        display: inline-block;
        width: 40px;
    }

    @media (max-width: 600px) {
        font-size: 30px;

        span {
            width: 32px;
        }
    }

    @media (max-width: 500px) {
        font-size: 20px;

        span {
            width: 25px;
        }
    }
`;

export const PlayerWrapper = styled.div`
    height: 50px;
    width: 100%;
    margin-bottom: 10px;
    background-color: #283c4e;
    border-right: none;
    position: relative;

    &:last-of-type {
        margin: 0;
    }

    @media (max-width: 450px) {
        ${(props) =>
            props.$minimized &&
            css`
                height: 70px; ;
            `}
    }
`;

export const Player = styled.div`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    padding: 0 20px;
    font-size: 20px;
    font-weight: 1000;

    ${(props) =>
        props.$left &&
        css`
            opacity: 0.2;
        `}

    @media (max-width: 720px) {
        justify-content: center;
        flex-direction: column;
    }
`;

export const Username = styled.div`
    display: flex;
    align-items: center;
    overflow: hidden;
    font-size: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    span {
        margin-left: 5px;
        font-size: 12px;
        padding: 2px 7px;
        background-color: #1d2c3a;
        border-radius: 10px;
    }

    @media (max-width: 720px) {
        font-size: 15px;

        span {
            font-size: 10px;
        }
    }
`;

export const Wpm = styled.div`
    font-size: 20px;

    @media (max-width: 720px) {
        font-size: 15px;
    }
`;

export const Details = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-left: 10px;

    @media (max-width: 720px) {
        margin: 0;
    }

    @media (max-width: 450px) {
        flex-direction: column;
    }
`;

export const ReadySwitch = styled.div`
    width: 120px;
    height: 26px;
    display: flex;
    justify-content: flex-end;

    & > div {
        height: 100%;
        border: 1px solid #008800;
        color: #008800;
        padding: 0 5px;
        font-weight: 600;
        font-size: 15px;
        line-height: 24px;
        margin-right: 18px;

        ${(props) =>
            props.$notReady &&
            css`
                color: #ff0000;
                border-color: #ff0000;
                margin: 0;
            `}
    }

    @media (max-width: 720px) {
        height: 20px;
        width: 90px;
        justify-content: center;
        margin-top: 2px;

        & > div {
            font-size: 10px;
            line-height: 18px;
            margin: 0;
        }
    }
`;

export const Position = styled.div`
    flex-shrink: 0;
    display: flex;
    align-items: center;
    font-size: 20px;

    span {
        display: flex;
        margin-right: 5px;
    }

    @media (max-width: 720px) {
        font-size: 15px;

        span {
            font-size: 15px;
            margin-left: 5px;
        }
    }
`;

export const PlayerProgress = styled.div`
    height: 100%;
    width: ${(props) => props.$progress}%;
    position: absolute;
    background-color: #3a5068;
    transition: width 1s ease;
`;

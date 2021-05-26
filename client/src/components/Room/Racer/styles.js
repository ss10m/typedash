import styled, { css } from "styled-components";

export const Input = styled.input`
    height: 80px;
    width: 100%;
    margin-top: 20px;
    padding: 0 20px;
    overflow: hidden;
    box-sizing: border-box;
    outline: none;
    border: 3px solid #203140;
    font-size: 35px;
    background-color: #203140;
    color: whitesmoke;

    &[type] {
        -webkit-appearance: none;
        border-radius: 7px;
    }

    &[placeholder] {
        text-overflow: ellipsis;
    }

    &::placeholder {
        color: whitesmoke;
        opacity: 0.2;
    }

    ${(props) =>
        props.$typo &&
        css`
            border: 3px solid red;
        `}

    @media (max-width: 600px) {
        height: 50px;
        font-size: 25px;
    }
`;

export const Quote = styled.div`
    margin-top: 20px;
    border: 3px solid #203140;
    border-radius: 7px;
    color: whitesmoke;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
        "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
`;

export const Words = styled.div`
    font-size: 23px;
    line-height: 28px;
    padding: 20px;

    @media (max-width: 600px) {
        font-size: 18px;
    }
`;

export const Word = styled.span`
    ${(props) =>
        props.$correct &&
        css`
            color: palegreen;
        `}
`;

export const Letter = styled.span`
    ${(props) =>
        props.$current &&
        css`
            outline: solid 1px yellow;
        `}

    ${(props) =>
        props.$currentWord &&
        css`
            text-decoration: underline;
        `}

    ${(props) =>
        props.$correct &&
        css`
            color: palegreen;
        `}

    ${(props) =>
        props.$typo &&
        css`
            background-color: red;
            color: white;
        `}
`;

export const Stats = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    padding-top: 5px;
    background-color: #203140;
    font-size: 15px;

    & > div {
        display: flex;
    }

    @media (max-width: 600px) {
        flex-direction: column;
        align-items: center;
    }
`;

export const Stat = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    margin: 5px;
`;

export const Header = styled.p`
    color: gold;
    font-size: 12px;
`;

export const Value = styled.p`
    font-weight: 600;
`;

export const Divider = styled.div`
    width: 3px;
    background-color: #2c3f54;
    margin: 7px 5px;
`;

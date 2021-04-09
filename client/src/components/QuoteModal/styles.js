import styled, { css } from "styled-components";

export const Background = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    animation: animate 0.15s ease-in forwards;

    @keyframes animate {
        from {
            background: rgba(0, 0, 0, 0);
        }
        to {
            background: rgba(0, 0, 0, 0.55);
        }
    }
`;

export const Wrapper = styled.div`
    min-width: 320px;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Modal = styled.div`
    max-width: 550px;
    display: flex;
    flex-direction: column;
    margin: 10px;
    padding: 3px;
    border: 2px solid #3a5068;
    border-radius: 7px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
        "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: whitesmoke;
    background-color: #203140;
`;

export const Header = styled.div`
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-weight: 500;
    padding: 0 10px;
    padding-bottom: 3px;

    p {
        font-size: 14px;
    }

    & > div {
        display: flex;
    }
`;

export const Button = styled.div`
    padding: 2px 5px;
    border: 2px solid #3a5068;
    border-radius: 3px;
    background-color: #2c3f54;
    cursor: pointer;

    &:hover {
        background-color: #3a5068;
    }

    ${(props) =>
        props.close &&
        css`
            margin-left: 5px;
            border: 2px solid #ff4e4e;
            background-color: #863636;

            &:hover {
                background-color: #ff4e4e;
            }
        `}
`;

export const Quote = styled.div`
    font-size: 20px;
    line-height: 28px;
    padding: 20px;
    background-color: #2c3f54ba;

    @media (max-width: 570px) {
        font-size: 16px;
    }
`;

export const Stats = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    padding-top: 5px;
    font-size: 15px;

    & > div {
        display: flex;
    }

    @media (max-width: 570px) {
        flex-direction: column;
        align-items: center;
    }
`;

export const Stat = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    margin: 5px;

    p {
        &:nth-child(1) {
            color: gold;
            font-size: 12px;
        }

        &:nth-child(2) {
            font-weight: 600;
        }
    }
`;

export const Divider = styled.div`
    width: 3px;
    margin: 7px 5px;
    background-color: #2c3f54;
`;

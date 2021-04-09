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
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 10px;
    color: whitesmoke;
`;

export const Tabs = styled.div`
    height: 50px;
    font-size: 25px;
    display: flex;
    font-size: 18px;
    font-weight: 600;
    background-color: #2c3f54;
    border-radius: 7px 7px 0 0;

    @media (max-width: 500px) {
        font-size: 12px;
    }
`;

export const Tab = styled.div`
    flex-grow: 1;
    text-align: center;
    line-height: 50px;
    border-radius: 7px 7px 0 0;

    ${(props) =>
        props.selected
            ? css`
                  background-color: #3a5068;
              `
            : css`
                  &:hover {
                      background-color: #203140;
                      cursor: pointer;
                  }
              `}
`;

export const Results = styled.div`
    height: 442px;
    background-color: #203140;
    display: flex;
    flex-direction: column;
    border: 2px solid #3a5068;
    border-top: 0;

    @media (max-width: 500px) {
        font-size: 12px;
    }
`;

export const ResultsHeader = styled.div`
    height: 40px;
    display: flex;
    background-color: #3a5068;
    font-weight: 600;

    div {
        text-align: center;
        line-height: 40px;

        &:nth-child(1) {
            flex-basis: 8%;
        }

        &:nth-child(2) {
            flex-basis: 30%;
        }

        &:nth-child(3) {
            flex-basis: 18%;
        }

        &:nth-child(4) {
            flex-basis: 18%;
        }

        &:nth-child(5) {
            flex-basis: 26%;
        }
    }
`;

export const ResultsData = styled.div`
    flex: 1;

    ${(props) =>
        props.empty &&
        css`
            display: flex;
            justify-content: center;
            align-items: center;
        `}
`;

export const Result = styled.div`
    display: flex;
    height: 40px;
    justify-content: space-between;
    line-height: 40px;
    border-bottom: 2px solid #2c3f54;

    div {
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:nth-child(1) {
            flex-basis: 8%;
            font-weight: 600;
            background-color: #2c3f54;
        }

        &:nth-child(2) {
            flex-basis: 30%;
            padding: 0 5px;
        }

        &:nth-child(3) {
            flex-basis: 18%;
        }

        &:nth-child(4) {
            flex-basis: 18%;
        }

        &:nth-child(5) {
            flex-basis: 26%;
        }
    }

    &:nth-child(10) {
        border-bottom: 0;
    }
`;

export const Footer = styled.div`
    height: 35px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #2c3f54;
    border: 2px solid #3a5068;
    border-top: 0;
    border-radius: 0 0 7px 7px;
    font-weight: 500;
    font-size: 14px;
    padding: 0 10px;
`;

export const Button = styled.div`
    padding: 0 5px;
    border: 2px solid #ff4e4e;
    border-radius: 3px;
    font-size: 12px;
    background-color: #863636;
    cursor: pointer;

    &:hover {
        background-color: #ff4e4e;
    }
`;

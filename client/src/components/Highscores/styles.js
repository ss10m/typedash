import styled, { css } from "styled-components";

export const Highscores = styled.div`
    min-height: 500px;
    flex: 1;
    display: flex;
    flex-direction: column;
    border-radius: 7px;
    color: whitesmoke;
`;

export const Tabs = styled.div`
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    font-size: 18px;
    font-weight: 600;
    background-color: #2c3f54;
    border-radius: 7px 7px 0 0;
    border: 2px solid #3a5068;
    border-bottom: none;

    @media (max-width: 500px) {
        font-size: 16px;
    }
`;

export const RefreshBtn = styled.div`
    position: absolute;
    right: 10px;
    display: flex;
    padding: 5px;
    border-radius: 5px;
    font-size: 20px;
    color: whitesmoke;
    background-color: #304256;
    border: 2px solid #3a5068;
    box-shadow: 0px 0px 1px 1px #171717;

    ${(props) =>
        props.$disabled
            ? css`
                  span {
                      opacity: 0.6;
                  }
              `
            : css`
                  &:hover {
                      cursor: pointer;
                      background-color: #2c3f54;
                  }
              `}

    span {
        display: flex;

        @keyframes spin {
            100% {
                -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
            }
        }

        ${(props) =>
            props.$animate &&
            css`
                animation: spin 0.8s linear 1;
            `}
    }
`;

export const Header = styled.div`
    height: 40px;
    display: flex;
    justify-content: space-between;
    background-color: #3a5068;
    font-weight: 600;

    div {
        text-align: center;
        line-height: 40px;
    }

    @media (max-width: 500px) {
        font-size: 11px;
    }
`;

export const Scores = styled.div`
    flex: 1;
    background-color: #233545;
    border: 2px solid #3a5068;
    border-top: none;
    display: flex;
    flex-direction: column;
    font-size: 15px;

    @media (max-width: 600px) {
        font-size: 13px;
    }

    @media (max-width: 500px) {
        font-size: 11px;
    }
`;

export const NoResults = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Result = styled.div`
    height: 40px;
    line-height: 38px;
    display: flex;
    border-bottom: 2px solid #2c3f54;

    ${(props) =>
        props.$hideBorder &&
        css`
            border: none;
        `}
`;

export const Rank = styled.div`
    flex-basis: 10%;
`;

export const Username = styled.div`
    flex-basis: 28%;
`;

export const Wpm = styled.div`
    flex-basis: 16%;
`;

export const Accuracy = styled.div`
    flex-basis: 13%;
`;

export const Time = styled.div`
    flex-basis: 18%;
`;

export const Quote = styled.div`
    flex-basis: 15%;
`;

const field = css`
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const RankValue = styled(Rank)`
    ${field}
    font-weight: 800;
    background-color: #2c3f54;

    @media (max-width: 500px) {
        font-size: 9px;
        font-weight: 400;
    }
`;

export const UsernameValue = styled(Username)`
    ${field}

    a {
        padding: 0 5px;
        text-decoration: none;
        font-weight: 800;
        color: whitesmoke;

        &:hover {
            text-decoration: underline;
        }
    }
`;

export const WpmValue = styled(Wpm)`
    ${field}
`;

export const AccuracyValue = styled(Accuracy)`
    ${field}
`;

export const TimeValue = styled(Time)`
    ${field}
`;

export const QuoteValue = styled(Quote)`
    ${field}

    span {
        font-size: 12px;
        cursor: pointer;
        padding: 0 3px;
        padding-top: 1px;
        border-radius: 5px;
        background-color: #2c3f54;
        border: 2px solid #3a5068;
        box-shadow: 0px 0px 1px 1px #171717;

        &:hover {
            background-color: #3a5068;
        }
    }
`;

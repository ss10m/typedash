import styled, { css } from "styled-components";

export const Tabs = styled.div`
    height: 50px;
    display: flex;
    font-size: 18px;
    font-weight: 600;
    background-color: #2c3f54;
    border-radius: 7px 7px 0 0;

    @media (max-width: 650px) {
        font-size: 14px;
    }

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
        props.$selected
            ? css`
                  background-color: #3a5068;
              `
            : css`
                  :hover {
                      cursor: pointer;
                      background-color: #203140;
                  }
              `}
`;

export const Results = styled.div`
    height: 442px;
    background-color: #233545;
    display: flex;
    flex-direction: column;
    border: 2px solid #3a5068;
    border-top: 0;

    @media (max-width: 650px) {
        font-size: 14px;
    }

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
    }
`;

export const Rank = styled.div`
    flex-basis: 8%;
`;

export const Wpm = styled.div`
    flex-basis: 24%;
`;

export const Accuracy = styled.div`
    flex-basis: 22%;
`;

export const Quote = styled.div`
    flex-basis: 18%;
`;

export const Time = styled.div`
    flex-basis: 28%;
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

    &:nth-child(10) {
        border-bottom: 0;
    }
`;

const field = css`
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const RankValue = styled(Rank)`
    ${field}
    font-weight: 600;
    background-color: #2c3f54;
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
    text-decoration: none;
    color: whitesmoke;

    span {
        font-size: 12px;
        cursor: pointer;
        padding: 1px 3px;
        border-radius: 5px;
        background-color: #2c3f54;
        border: 2px solid #3a5068;

        &:hover {
            background-color: #3a5068;
        }
    }
`;

export const Footer = styled.div`
    height: 30px;
    background-color: #2c3f54;
    border: 2px solid #3a5068;
    border-top: 0;
    border-radius: 0 0 7px 7px;
`;

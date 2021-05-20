import styled, { css, keyframes } from "styled-components";

export const Rooms = styled.div`
    min-height: 500px;
    flex: 1;
    border-radius: 7px;
    display: flex;
    flex-direction: column;
    color: whitesmoke;
    border: 2px solid #3a5068;
    background-color: #3a5068;
    margin-bottom: 10px;
`;

export const Banner = styled.img`
    display: flex;
    width: 100%;
    max-height: 150px;
    object-fit: cover;
    min-height: 120px;
    border-radius: 7px 7px 0 0;
    filter: grayscale(100%) opacity(50%);
`;

export const Navigation = styled.div`
    display: grid;
    grid-template-areas: "create refresh filter";
    grid-template-columns: 250px 60px 1fr;
    grid-template-rows: 60px;
    grid-gap: 10px;
    padding: 10px;
    background-color: #2c3f54;

    @media (max-width: 700px) {
        grid-template-columns: 220px 60px 1fr;
    }

    @media (max-width: 600px) {
        grid-template-areas:
            "create refresh"
            "filter filter";
        grid-template-rows: 45px 45px;
        grid-template-columns: 1fr 45px;
    }
`;

const Button = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 7px;
    font-size: 30px;
    color: whitesmoke;
    background-color: #203140;
    box-shadow: 0px 0px 1px 1px #080808;
`;

export const CreateButton = styled(Button)`
    grid-area: create;

    &:hover {
        cursor: pointer;
        background-color: #233646;
        box-shadow: 0px 0px 3px 1px #080808;
    }

    @media (max-width: 400px) {
        font-size: 20px;
    }
`;

const spin = keyframes`
    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
`;

export const RefreshButton = styled(Button)`
    grid-area: refresh;

    ${(props) =>
        props.$disabled
            ? css`
                  opacity: 0.7;
              `
            : css`
                  &:hover {
                      cursor: pointer;
                      background-color: #233646;
                      box-shadow: 0px 0px 3px 1px #080808;
                  }
              `}

    span {
        display: flex;

        ${(props) =>
            props.$disabled &&
            css`
                animation: ${spin} 0.8s linear 1;
            `}
    }

    @media (max-width: 600px) {
        font-size: 24px;
    }
`;

export const Filter = styled.div`
    grid-area: filter;
    height: 100%;
    display: flex;
    box-sizing: border-box;
    border-radius: 7px;
`;

export const Input = styled.input`
    height: 100%;
    width: 100%;
    border: none;
    outline: none;
    font-size: 30px;
    color: whitesmoke;
    background-color: #203140ad;

    ${(props) =>
        props.$rounded &&
        css`
            border-radius: 0 7px 7px 0 !important;
            padding-right: 10px;
        `}

    &::placeholder {
        color: #d6d5d5;
    }

    @media (max-width: 600px) {
        font-size: 22px;
    }
`;

export const Icon = styled.div`
    height: 100%;
    width: 60px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #203140ad;
    box-sizing: border-box;
    border-radius: 7px 0 0 7px;
    font-size: 30px;
    color: whitesmoke;

    ${(props) =>
        props.$right &&
        css`
            width: 50px;
            border-radius: 0 7px 7px 0;
            font-size: 20px;

            span {
                display: flex;
                border-radius: 7px;
                padding: 4px;

                &:hover {
                    cursor: pointer;
                    background-color: #3a5068;
                }
            }
        `}

    @media (max-width: 600px) {
        font-size: 22px;
    }
`;

export const Header = styled.div`
    height: 40px;
    display: flex;
    justify-content: space-between;
    background-color: #3a5068;
    font-weight: 600;

    @media (max-width: 600px) {
        font-size: 12px;
    }
`;

export const Name = styled.div`
    flex-basis: 30%;
`;

export const Status = styled.div`
    flex-basis: 20%;
`;

export const Count = styled.div`
    flex-basis: 8%;
`;

export const Uptime = styled.div`
    flex-basis: 17%;
`;

export const Join = styled.div`
    flex-basis: 25%;
`;

const header = css`
    text-align: center;
    line-height: 40px;
`;

export const NameHeader = styled(Name)`
    ${header}
`;

export const StatusHeader = styled(Status)`
    ${header}
`;

export const CountHeader = styled(Count)`
    display: flex;
    align-items: center;
    justify-content: center;

    span {
        display: flex;
    }
`;

export const UptimeHeader = styled(Uptime)`
    ${header}
`;

export const JoinHeader = styled(Join)`
    ${header}
`;

export const Results = styled.div`
    flex: 1;
    position: relative;
    background-color: #203140;
    overflow: auto;

    &::-webkit-scrollbar {
        width: 10px;
    }

    &::-webkit-scrollbar-track {
        background: #14222b;
    }

    &::-webkit-scrollbar-thumb {
        background: #304763;
    }

    & > div {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
`;

export const EmptyList = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: 500;

    @media (max-width: 600px) {
        font-size: 15px;
    }
`;

export const ResetButton = styled.div`
    font-size: 16px;
    margin-top: 10px;
    padding: 5px 10px;
    border-radius: 7px;
    font-weight: 500;
    color: whitesmoke;
    background-color: #2d465d;
    box-shadow: 0px 0px 1px 1px #080808;

    &:hover {
        cursor: pointer;
    }

    @media (max-width: 600px) {
        font-size: 12px;
    }
`;

export const Room = styled.div`
    width: 100%;
    height: 70px;
    display: flex;
    font-size: 20px;
    background-color: #2c3f54;
    border-bottom: 2px solid #3a5068;

    @media (max-width: 600px) {
        font-size: 15px;
        height: 50px;
    }
`;

const value = css`
    line-height: 70px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 600px) {
        line-height: 50px;
    }
`;

export const NameValue = styled(Name)`
    ${value}
    font-weight: 700;
`;

export const StatusValue = styled(Status)`
    ${value}
    text-transform: uppercase;
    font-size: 12px;

    @media (max-width: 600px) {
        font-size: 9px;
    }

    span {
        padding: 2px 5px;
        background-color: #4778ab;
        border-radius: 5px;
        font-weight: 700;

        ${(props) =>
            props.$playing &&
            css`
                background-color: green;
            `}
    }
`;

export const CountValue = styled(Count)`
    ${value}
`;

export const UptimeValue = styled(Uptime)`
    ${value}
`;

export const JoinValue = styled(Join)`
    ${value}

    button {
        width: 75%;
        height: 40px;
        background-color: #bfb325;
        border-radius: 7px;
        outline: none;
        border: none;
        font-size: 20px;
        font-weight: 800;
        cursor: pointer;
        box-shadow: 0px 0px 1px 1px #080808;

        @media (max-width: 600px) {
            height: 30px;
            font-size: 15px;
        }
    }
`;

export const Footer = styled.div`
    height: 30px;
    background-color: #2c3f54;
    border-top: 2px solid #3a5068;
    border-radius: 0 0 7px 7px;
`;

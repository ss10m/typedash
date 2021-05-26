import styled, { css } from "styled-components";

export const Spectators = styled.div`
    height: 235px;
    width: 280px;
    position: absolute;
    top: 48px;
    right: 0;
    z-index: 8;
    border-radius: 5px;
    border: 2px solid #3a5068;
    color: whitesmoke;
    box-shadow: 0px 0px 1px 1px #080808;
    display: flex;
    flex-direction: column;
    background-color: #203140;
`;

export const Header = styled.div`
    display: flex;
    font-size: 15px;
    font-weight: 600;
    padding: 5px 0;
    background-color: #3a5068;

    div {
        text-align: center;
    }
`;

export const Username = styled.div`
    flex-basis: 60%;
`;

export const Status = styled.div`
    flex-basis: 40%;
`;

export const SpectatorList = styled.div`
    flex: 1;
    overflow: auto;

    &::-webkit-scrollbar {
        width: 5px;
    }

    &::-webkit-scrollbar-track {
        background: #14222b;
    }

    &::-webkit-scrollbar-thumb {
        background: #34465a;
    }

    ${(props) =>
        props.$empty &&
        css`
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 500;
        `}
`;

export const Spectator = styled.div`
    height: 40px;
    margin-top: 4px;
    display: flex;
    background-color: #2c3f54;
    text-align: center;
    line-height: 40px;
`;

export const UsernameValue = styled(Username)`
    font-size: 18px;
    font-weight: 600;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const StatusValue = styled(Status)`
    display: flex;
    align-items: center;
    justify-content: center;
    color: red;

    ${(props) =>
        props.$playNext &&
        css`
            color: green;
        `}
`;

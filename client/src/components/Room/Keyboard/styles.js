import styled, { css } from "styled-components";

export const Wrapper = styled.div`
    margin: 20px 0;
    height: 270px;
`;

export const Keyboard = styled.div`
    width: 787px;
    height: 268px;
    position: relative;
    left: 50%;
    top: 50%;
    padding: 3px 4px;
    border-radius: 10px;
    background-color: black;

    span {
        display: block;
        margin-bottom: -6px;
    }
`;

export const Row = styled.div`
    margin-top: 2px;
    overflow: hidden;
`;

export const Key = styled.div`
    width: ${(props) => (props.$width ? props.$width : 50)}px;
    height: 50px;
    float: left;
    background-color: #fffff4;
    color: #000000;
    line-height: 50px;
    text-align: center;
    margin-left: 2px;
    font-size: 15px;
    border-radius: 5px;

    ${(props) =>
        props.$secondary &&
        css`
            line-height: 28px;
        `}

    ${(props) =>
        props.$valid &&
        css`
            background-color: #c4ffc4;
        `}

    ${(props) =>
        props.$invalid &&
        css`
            background-color: #ff9797;
        `}
`;

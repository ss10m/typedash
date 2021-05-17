import styled, { css } from "styled-components";

export const Input = styled.div`
    height: 45px;
    display: flex;
    margin: 8px 0;
`;

export const Icon = styled.div`
    height: 100%;
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #374858;
    border: 3px solid #374858;
    border-right: none;
    border-radius: 7px 0 0 7px;
    font-size: 18px;
    color: whitesmoke;

    ${(props) =>
        props.$error &&
        css`
            border-color: red;
        `}
`;

export const InputField = styled.input`
    height: 100%;
    flex: 1;
    overflow: hidden;
    outline: none;
    border: 3px solid #374858;
    border-left: none;
    border-right: none;
    font-size: 18px;
    background-color: #374858;
    color: whitesmoke;

    &::placeholder {
        color: #8f8f8f;
    }

    ${(props) =>
        props.$error &&
        css`
            border-color: red;
        `}
`;

export const Status = styled.div`
    height: 100%;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid #374858;
    border-left: none;
    border-radius: 0 7px 7px 0;
    font-size: 20px;
    color: red;
    background-color: #374858;

    ${(props) =>
        props.$error &&
        css`
            border-color: red;
        `}
`;

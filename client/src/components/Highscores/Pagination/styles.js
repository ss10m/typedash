import styled, { css } from "styled-components";

export const Pagination = styled.div`
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2c3f54;
    border: 2px solid #3a5068;
    border-radius: 0 0 7px 7px;
    border-top: none;
    margin-bottom: ${(props) => props.$marginBottom + "px"};
`;

export const Button = styled.div`
    display: flex;
    font-size: 23px;
    border-radius: 5px;
    position: relative;
    margin: 0 3px;
    background-color: #304256;
    border: 2px solid #3a5068;
    box-shadow: 0px 0px 1px 1px #171717;

    @media (max-width: 500px) {
        font-size: 17px;
    }

    ${(props) =>
        props.$left &&
        css`
            padding: 3px 6px 3px 5px;
        `}

    ${(props) =>
        props.$right &&
        css`
            padding: 3px 5px 3px 6px;
        `}

    ${(props) =>
        props.$disabled
            ? css`
                  opacity: 0.6;
              `
            : css`
                  &:hover {
                      cursor: pointer;
                      background-color: #2c3f54;
                  }
              `}
`;

export const InputContainer = styled.div`
    height: 30px;
    margin: 0 7px 0 6px;

    input {
        height: 100%;
        width: 50px;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        outline: none;
        border: none;
        border-radius: 5px;
        color: whitesmoke;
        background-color: #1a2a357a;

        &::placeholder {
            color: #d6d5d5;
        }
    }

    span {
        font-size: 16px;
        font-weight: 500;
    }

    @media (max-width: 500px) {
        height: 25px;

        input {
            font-size: 12px;
        }

        span {
            font-size: 12px;
        }
    }
`;

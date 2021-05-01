import styled, { css, keyframes } from "styled-components";

const fadeOut = keyframes`
    from {
        background: rgba(0, 0, 0, 0);
    }
    to {
        background: rgba(0, 0, 0, 0.55);
    }
`;

export const Background = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: auto;
    animation: ${fadeOut} 0.15s ease-in forwards;
`;

export const Wrapper = styled.div`
    min-width: 320px;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const Modal = styled.div`
    max-width: 600px;
    width: 100%;
    padding: 10px;
`;

export const Settings = styled.div`
    height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 15px 20px;
    border: 2px solid #3a5068;
    border-radius: 7px;
    color: whitesmoke;
    background-color: #203140;
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 35px;

    @media (max-width: 400px) {
        font-size: 25px;
    }

    p {
        font-weight: 800;
    }

    span {
        display: flex;

        &:hover {
            border-radius: 5px;
            background-color: #3a5068;
            cursor: pointer;
        }
    }
`;

export const IconWrapper = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const ChangerHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    p {
        font-size: 16px;
        font-weight: 600;

        @media (max-width: 400px) {
            font-size: 13px;
        }
    }
`;

export const Message = styled.p`
    font-size: 12px;
    padding-left: 20px;
    font-weight: 600;
    color: ${(props) => props.$color};
`;

export const Button = styled.button`
    margin-left: 5px;
    padding: 2px 5px;
    border: 2px solid #3a5068;
    border-radius: 3px;
    font-weight: 600;
    background-color: #2c3f54;
    color: whitesmoke;

    ${(props) =>
        props.disabled
            ? css`
                  pointer-events: none;
                  opacity: 0.5;
              `
            : css`
                  &:hover {
                      cursor: pointer;
                      background-color: #3a5068;
                  }
              `}
`;

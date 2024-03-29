import styled, { css } from "styled-components";

export const Navigation = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

export const RoomName = styled.p`
    font-weight: 800;
    font-size: 30px;
    letter-spacing: 1px;
`;

export const Button = styled.div`
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2c3f54;
    border-radius: 7px;
    box-shadow: 0px 0px 1px 1px #080808;
    border: 2px solid #3a5068;
    cursor: pointer;
    font-size: 18px;
    font-weight: 600;

    &:hover {
        background-color: #31465d;
    }

    ${(props) =>
        props.$extended &&
        css`
            width: 170px;

            span {
                margin-right: 8px;
            }
        `}

    span {
        display: flex;
        font-size: 20px;
    }
`;

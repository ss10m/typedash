import styled from "styled-components";

export const Spectating = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    @media (max-width: 500px) {
        flex-direction: column;
        align-items: center;
    }

    p {
        font-size: 18px;
        font-weight: 700;
    }
`;

export const Button = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #2c3f54;
    border-radius: 7px;
    padding: 0 5px;
    box-shadow: 0px 0px 1px 1px #080808;
    border: 2px solid #3a5068;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;

    @media (max-width: 500px) {
        margin-top: 5px;
    }
`;

export const Label = styled.label`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 3px;

    span {
        display: flex;
        font-size: 14px;
        font-weight: 700;
        margin-right: 5px;
    }
`;

import styled from "styled-components";

export const Stats = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 615px) {
        flex-direction: column;
    }
`;

export const Details = styled.div`
    display: flex;
    padding: 1px 5px;
    border-radius: 7px;
    border: 3px solid #203140;
    text-align: center;
`;

export const Column = styled.div`
    margin: 5px 5px;
    width: ${(props) => props.$width}px;
`;

export const Title = styled.p`
    font-size: 12px;
    font-weight: 600;
    color: gold;
`;

export const Value = styled.p`
    font-size: 18px;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
`;

export const Divider = styled.div`
    width: 3px;
    background-color: #203140;
    margin: 10px 5px;
`;

export const ReadySwitch = styled.label`
    display: flex;
    justify-content: center;
    align-items: center;

    @media (max-width: 615px) {
        margin-top: 20px;
    }

    span {
        display: flex;
        font-size: 14px;
        font-weight: 700;
        margin-right: 5px;
    }
`;

export const Timer = styled.div`
    font-weight: 700;
    font-size: 40px;
    font-variant-numeric: tabular-nums;

    @media (max-width: 615px) {
        margin-top: 15px;
    }
`;

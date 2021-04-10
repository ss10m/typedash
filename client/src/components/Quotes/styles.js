import styled from "styled-components";

export const Quotes = styled.div`
    min-height: 500px;
    flex: 1;
`;

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px 20px 10px 20px;
    color: whitesmoke;
    font-weight: 800;

    p {
        font-size: 35px;
    }

    & > div {
        display: flex;
    }

    @media (max-width: 540px) {
        flex-direction: column;

        & > div {
            margin: 10px 0;
        }
    }
`;

export const SortSelect = styled.div`
    width: 220px;
    font-size: 14px;
    input {
        color: whitesmoke !important;
    }
`;

export const OrderToggle = styled.div`
    height: 38px;
    width: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 5px;
    font-size: 18px;
    border: 1px solid #3a5068;
    border-radius: 3px;

    &:hover {
        cursor: pointer;
        border-color: #56779a;
    }
`;

export const Quote = styled.div`
    margin-top: 30px;
    background-color: #203140;
    padding: 3px;
    border-radius: 7px;
    color: whitesmoke;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
        "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    &:nth-of-type(1) {
        margin-top: 0;
    }
`;

export const QuoteHeader = styled.div`
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    font-weight: 500;
    padding: 0 10px;
    padding-bottom: 3px;

    p {
        font-size: 14px;
    }

    & > div {
        display: flex;
    }
`;

export const Button = styled.div`
    margin-left: 5px;
    padding: 2px 5px;
    border: 2px solid #3a5068;
    background-color: #2c3f54;
    border-radius: 3px;

    &:hover {
        cursor: pointer;
        background-color: #3a5068;
    }
`;

export const Words = styled.div`
    font-size: 20px;
    line-height: 28px;
    padding: 20px;
    background-color: #2c3f54ba;

    @media (max-width: 600px) {
        font-size: 16px;
    }
`;

export const Stats = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    padding-top: 5px;
    font-size: 15px;

    & > div {
        display: flex;
    }

    @media (max-width: 600px) {
        flex-direction: column;
        align-items: center;
    }
`;

export const Stat = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    margin: 5px;

    p {
        &:nth-child(1) {
            color: gold;
            font-size: 12px;
        }

        &:nth-child(2) {
            font-weight: 600;
        }
    }
`;

export const Divider = styled.div`
    width: 3px;
    margin: 7px 5px;
    background-color: #2c3f54;
`;

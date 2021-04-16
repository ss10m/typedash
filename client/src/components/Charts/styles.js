import styled, { css } from "styled-components";

export const EmptyChart = styled.div`
    margin-bottom: 30px;
    padding-top: 37.5%;
    position: relative;

    div {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid #203140;
        border-radius: 7px;
        font-size: 14px;
        font-weight: 500;
    }
`;

export const Header = styled.div`
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px 0 5px;

    p {
        font-size: 20px;
        font-weight: 600;
    }

    & > div {
        width: 200px;
    }

    @media (max-width: 500px) {
        p {
            font-size: 14px;
        }

        & > div {
            width: 140px;
        }
    }
`;

export const Chart = styled.div`
    position: relative;
    padding-top: 37.5%;
    min-height: 250px;
    margin-bottom: 20px;
    overflow: hidden;
`;

export const Background = styled.div`
    position: absolute;
    top: 0;
    left: -5px;
    bottom: 0;
    right: 0;
    font-size: 14px;

    @media (max-width: 500px) {
        font-size: 10px;
    }
`;

export const Tag = styled.div`
    position: absolute;

    ${(props) =>
        props.$wpm &&
        css`
            position: absolute;
            top: 0;
            bottom: 50px;
            left: 0;
            text-align: center;
            writing-mode: vertical-rl;
        `}

    ${(props) =>
        props.$progress &&
        css`
            position: absolute;
            bottom: 0;
            left: 50px;
            right: 0;
            text-align: center;
        `}
`;

export const Foreground = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    & > div {
        position: absolute;
        top: 10px;
        bottom: 0;
        left: 0;
        right: 18px;
        margin: 0 0 20px 17px;
        margin-right: ${(props) => (props.$padded ? "1px" : "0")};

        .tickLabel {
            fill: whitesmoke !important;
            white-space: nowrap !important;
        }

        .gridLine {
            stroke: #293e5487 !important;
        }

        .action-voronoi {
            fill: whitesmoke !important;
            stroke: white !important;
        }

        .Cursor {
            & > div:first-of-type {
                background: #3a506821 !important;
                border: 1px solid #3a506879;
            }

            div div {
                color: whitesmoke !important;
                background-color: #2c3f54 !important;
                font-weight: 800;
                border: 2px solid #3a5068;
            }
        }
    }
`;

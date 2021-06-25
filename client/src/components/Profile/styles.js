import styled from "styled-components";

export const Profile = styled.div`
    flex: 1;
    min-height: 500px;
    color: whitesmoke;
`;

export const Header = styled.div`
    height: 80px;
    display: flex;
    align-items: center;
    margin: 20px 0;
`;

export const Avatar = styled.div`
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    color: whitesmoke;
    font-size: 35px;
    box-shadow: 0px 0px 2px 1px black, 0px 0px 2px 1px black inset;
    font-weight: 1000;
    background-color: #2c3f54;
    border: 5px solid #3a5068;
    border-radius: 10px;
`;

export const Username = styled.div`
    flex: 1;
    position: relative;
    min-height: 80px;
    color: whitesmoke;

    & > div {
        position: absolute;
        width: 100%;
        height: 100%;
        text-shadow: 2px 2px black;
        overflow: hidden;
    }
`;

export const Stats = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
`;

export const StateRow = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    margin-bottom: 20px;
`;

export const StatsHeader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 10px;
    flex-basis: 170px;
    font-size: 18px;
    font-weight: 800;
`;

export const StatsColumns = styled.div`
    display: flex;
    justify-content: space-evenly;
    flex-direction: row;
    padding: 10px;
    border: 3px solid #203140;
    border-radius: 7px;

    @media (max-width: 730px) {
        flex-direction: column;
    }
`;

export const Stat = styled.div`
    text-align: center;
    padding: 0 25px;

    @media (max-width: 730px) {
        padding: 5px 15px;
    }
`;

export const StatHeader = styled.div`
    color: gold;
    font-size: 14px;
    font-weight: 700;
`;

export const StatValue = styled.div`
    font-size: 18px;
    font-weight: 800;
`;

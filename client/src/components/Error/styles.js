import styled from "styled-components";

export const Wrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: whitesmoke;
`;

export const Error = styled.div`
    flex: 1;
    min-height: 455px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 30px 20px;
`;

export const Image = styled.img`
    width: 200px;

    @media (max-width: 600px) {
        width: 150px;
    }
`;

export const Header = styled.p`
    text-align: center;
    font-size: 35px;
    font-weight: 800;

    @media (max-width: 600px) {
        font-size: 25px;
    }
`;

export const Message = styled.p`
    text-align: center;
    margin-top: 5px;
    font-size: 16px;
    font-weight: 600;
    color: #ff4e4e;
`;

export const Button = styled.button`
    margin-top: 20px;
    border: none;
    outline: none;
    padding: 10px 20px;
    border: 2px solid #3a5068;
    background-color: #2c3f54;
    color: whitesmoke;
    border-radius: 7px;
    font-size: 15px;
    font-weight: 800;
    box-shadow: 0px 0px 1px 1px black;

    &:hover {
        cursor: pointer;
        border-color: #415c79;
    }
`;

export const Logo = styled.div`
    position: absolute;
    bottom: 0;
    font-size: 20px;
    font-weight: 700;

    span {
        color: gold;
    }
`;

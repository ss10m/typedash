// Libraries & utils
import { useHistory } from "react-router-dom";

// Images
import error from "./error.svg";

// Styles
import * as Styled from "./styles";

const Error = ({ msg, forceRefresh }) => {
    const defaultMessage = "PAGE NOT FOUND";

    return (
        <Styled.Wrapper>
            <Styled.Error>
                <Styled.Image src={error} alt="Page not found"></Styled.Image>
                <Styled.Header>SOMETHING WENT WRONG</Styled.Header>
                <Styled.Message>{msg ? msg.toUpperCase() : defaultMessage}</Styled.Message>
                <Button forceRefresh={forceRefresh} />
                <Styled.Logo>
                    TYPE<span>DASH</span>
                </Styled.Logo>
            </Styled.Error>
        </Styled.Wrapper>
    );
};

const Button = ({ forceRefresh }) => {
    const history = useHistory();

    const handleClick = () => {
        if (forceRefresh) {
            window.location.reload();
        } else {
            history.push("");
        }
    };

    return (
        <Styled.Button onClick={handleClick}>
            {forceRefresh ? "REFRESH" : "RETURN TO LOBBY"}
        </Styled.Button>
    );
};

export default Error;

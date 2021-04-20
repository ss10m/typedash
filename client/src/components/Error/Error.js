// Libraries & utils
import { useHistory } from "react-router-dom";

// Images
import error from "./error.svg";

// Styles
import * as Styles from "./styles";

const Error = ({ msg, forceRefresh }) => {
    const defaultMessage = "PAGE NOT FOUND";

    return (
        <Styles.Wrapper>
            <Styles.Error>
                <Styles.Image src={error} alt="Page not found"></Styles.Image>
                <Styles.Header>SOMETHING WENT WRONG</Styles.Header>
                <Styles.Message>{msg ? msg.toUpperCase() : defaultMessage}</Styles.Message>
                <Button forceRefresh={forceRefresh} />
                <Styles.Logo>
                    TYPE<span>DASH</span>
                </Styles.Logo>
            </Styles.Error>
        </Styles.Wrapper>
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
        <Styles.Button onClick={handleClick}>
            {forceRefresh ? "REFRESH" : "RETURN TO LOBBY"}
        </Styles.Button>
    );
};

export default Error;

// Libraries & utils
import classNames from "classnames";

// Icons
import { FaUser, FaKey, FaWindowClose } from "react-icons/fa";

// Constants
import { FIELD_TYPE } from "helpers/constants";

// Styles
import * as Styled from "./styles";

const Input = ({
    type,
    placeholder,
    input,
    setInput,
    credentials,
    setCredentials,
    isDisabled,
}) => {
    const handleInputChange = (event) => {
        const value = event.target.value;
        setInput({ value, valid: value.length > 0 });
        setCredentials({ valid: true, msg: "" });
    };

    return (
        <Styled.Input>
            <Icon type={type} credentials={credentials} />
            <Styled.InputField
                $error={!credentials.valid}
                type={type === FIELD_TYPE.PASSWORD ? "password" : "text"}
                value={input.value}
                onChange={handleInputChange}
                spellCheck={false}
                placeholder={placeholder}
                autoComplete="off"
                disabled={isDisabled}
            />
            <Status credentials={credentials} />
        </Styled.Input>
    );
};

const Icon = ({ type, credentials }) => {
    return (
        <Styled.Icon $error={!credentials.valid}>
            {type === FIELD_TYPE.USERNAME ? <FaUser /> : <FaKey />}
        </Styled.Icon>
    );
};

const Status = ({ credentials }) => {
    return (
        <Styled.Status $error={!credentials.valid}>
            {!credentials.valid && <FaWindowClose />}
        </Styled.Status>
    );
};

export default Input;

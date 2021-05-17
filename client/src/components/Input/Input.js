// Libraries & utils
import classNames from "classnames";

// Icons
import { FaUser, FaKey, FaWindowClose } from "react-icons/fa";

// Constants
import { FIELD_TYPE } from "helpers/constants";

// Styles
import * as Styles from "./styles";

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
        <Styles.Input>
            <Icon type={type} credentials={credentials} />
            <Styles.InputField
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
        </Styles.Input>
    );
};

const Icon = ({ type, credentials }) => {
    return (
        <Styles.Icon $error={!credentials.valid}>
            {type === FIELD_TYPE.USERNAME ? <FaUser /> : <FaKey />}
        </Styles.Icon>
    );
};

const Status = ({ credentials }) => {
    return (
        <Styles.Status $error={!credentials.valid}>
            {!credentials.valid && <FaWindowClose />}
        </Styles.Status>
    );
};

export default Input;

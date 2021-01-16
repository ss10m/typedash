// Libraries & utils
import classNames from "classnames";

// Icons
import { FaUser, FaKey, FaWindowClose } from "react-icons/fa";

// Constants
import { FIELD_TYPE } from "helpers/constants";

// SCSS
import "./Input.scss";

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
        <div className="basic-input">
            <Icon type={type} credentials={credentials} />
            <input
                className={classNames({ error: !credentials.valid })}
                type={type === FIELD_TYPE.PASSWORD ? "password" : "text"}
                value={input.value}
                onChange={handleInputChange}
                spellCheck={false}
                placeholder={placeholder}
                autoComplete="off"
                disabled={isDisabled}
            />
            <Status credentials={credentials} />
        </div>
    );
};

const Icon = ({ type, credentials }) => {
    let icon;
    switch (type) {
        case FIELD_TYPE.USERNAME:
            icon = <FaUser />;
            break;
        case FIELD_TYPE.PASSWORD:
            icon = <FaKey />;
            break;
        default:
            break;
    }
    return <div className={classNames("icon", { error: !credentials.valid })}>{icon}</div>;
};

const Status = ({ credentials }) => {
    return (
        <div
            className={classNames("status", {
                error: !credentials.valid,
            })}
        >
            {!credentials.valid && <FaWindowClose />}
        </div>
    );
};

export default Input;

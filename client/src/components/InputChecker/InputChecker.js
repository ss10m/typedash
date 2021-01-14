// Libraries & utils
import classNames from "classnames";

// Hooks
import useInputValidator from "./useInputValidator";

// Icons
import { FaUser, FaAt, FaKey, FaCheckCircle, FaWindowClose } from "react-icons/fa";

// Components
import Spinner from "../Spinner/Spinner";

// SCSS
import "./InputChecker.scss";

const InputChecker = ({ type, placeholder, initialValue, setIsValid, invalid, margin }) => {
    const { input, setInput, containsError, setContainsError, isFetching } = useInputValidator(
        type,
        initialValue,
        setIsValid
    );

    const handleInputChange = (event) => {
        const value = event.target.value;
        if (!value) setIsValid({ value: "", valid: false });
        setContainsError(false);
        setInput(value);
    };

    const showError = !isFetching && (invalid || containsError) && input.length;

    return (
        <div className={classNames("input-checker", { margin })}>
            <Icon type={type} showError={showError} />
            <input
                className={classNames({ error: showError })}
                type={type === "password" ? "password" : "text"}
                placeholder={placeholder}
                value={input}
                onChange={handleInputChange}
                spellCheck={false}
                autoComplete="off"
            />
            <Status inputLength={input.length} showError={showError} isFetching={isFetching} />
        </div>
    );
};

InputChecker.defaultProps = {
    invalid: false,
    margin: true,
};

const Icon = ({ type, showError }) => {
    let icon;
    switch (type) {
        case "username":
            icon = <FaUser />;
            break;
        case "email":
            icon = <FaAt />;
            break;
        case "password":
            icon = <FaKey />;
            break;
        default:
            break;
    }
    return <div className={classNames("icon", { error: showError })}>{icon}</div>;
};

const Status = ({ inputLength, showError, isFetching }) => {
    let status = null;
    if (isFetching) {
        status = <Spinner size={20} />;
    } else if (showError) {
        status = <FaWindowClose />;
    } else if (inputLength) {
        status = <FaCheckCircle />;
    }
    return (
        <div
            className={classNames("status", {
                success: !showError,
                error: showError,
            })}
        >
            {status}
        </div>
    );
};

export default InputChecker;

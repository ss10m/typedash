// Hooks
import useInputValidator from "./useInputValidator";

// Icons
import { FaUser, FaAt, FaKey, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Components
import Spinner from "../Spinner/Spinner";

// Constants
import { TEST_TYPE, FIELD_TYPE } from "helpers/constants";

// Styles
import * as Styled from "./styles";

const InputChecker = ({
    type,
    placeholder,
    initial,
    setIsValid,
    setIsChecking,
    test,
    invalid,
    margin,
    autofocus,
    isDisabled,
}) => {
    const { input, setInput, containsError, setContainsError, isFetching } = useInputValidator(
        type,
        initial,
        setIsValid,
        setIsChecking,
        test
    );

    const handleInputChange = (event) => {
        const value = event.target.value;
        if (!value) setIsValid({ value: "", valid: false });
        setContainsError(false);
        setInput(value);
    };

    const showError = !isFetching && (invalid || containsError) && input.length;

    return (
        <Styled.InputChecker $margin={margin}>
            <Icon type={type} showError={showError} />
            <Styled.Input
                $error={showError}
                type={type === FIELD_TYPE.PASSWORD ? "password" : "text"}
                placeholder={placeholder}
                value={input}
                onChange={handleInputChange}
                spellCheck={false}
                autoComplete="off"
                autoFocus={autofocus}
                disabled={isDisabled}
            />
            <Status inputLength={input.length} showError={showError} isFetching={isFetching} />
        </Styled.InputChecker>
    );
};

InputChecker.defaultProps = {
    test: TEST_TYPE.VALID,
    invalid: false,
    margin: true,
    autofocus: false,
    isDisabled: false,
};

const Icon = ({ type, showError }) => {
    let icon;
    switch (type) {
        case FIELD_TYPE.USERNAME:
            icon = <FaUser />;
            break;
        case FIELD_TYPE.EMAIL:
            icon = <FaAt />;
            break;
        case FIELD_TYPE.PASSWORD:
            icon = <FaKey />;
            break;
        default:
            break;
    }
    return <Styled.Icon $error={showError}>{icon}</Styled.Icon>;
};

const Status = ({ inputLength, showError, isFetching }) => {
    let status = null;
    if (isFetching) {
        status = <Spinner size={20} />;
    } else if (showError) {
        status = <FaTimesCircle />;
    } else if (inputLength) {
        status = <FaCheckCircle />;
    }
    return <Styled.Status $error={showError}>{status}</Styled.Status>;
};

export default InputChecker;

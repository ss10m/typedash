// Icons
import { FaUser, FaKey, FaTimes } from "react-icons/fa";

// SCSS
import "./Input.scss";

const Input = ({ type, placeholder, input, setInput, autofocus }) => {
    return (
        <div className="basic-input">
            <Icon type={type} />
            <input
                //className="error"
                type="text"
                value={input.value}
                onChange={(e) => setInput({ value: e.target.value, valid: true })}
                spellCheck={false}
                placeholder={placeholder}
                autoComplete="off"
                autoFocus={autofocus}
            />
            <div className="status">
                {input.value && (
                    <span onClick={() => setInput({ value: "", valid: false })}>
                        <FaTimes />
                    </span>
                )}
            </div>
        </div>
    );
};

const Icon = ({ type }) => {
    let icon;
    switch (type) {
        case "username":
            icon = <FaUser />;
            break;
        case "password":
            icon = <FaKey />;
            break;
        default:
            break;
    }
    return <div className="icon">{icon}</div>;
};

export default Input;

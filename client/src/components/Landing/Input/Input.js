// Icons
import { FaUser, FaKey, FaTimes } from "react-icons/fa";

// SCSS
import "./Input.scss";

const Input = ({ id, placeholder, input, setInput, autofocus }) => {
    let icon;
    switch (id) {
        case "username":
            icon = <FaUser />;
            break;
        case "password":
            icon = <FaKey />;
            break;
        default:
            break;
    }

    return (
        <div className="basic-input">
            <div className="icon">{icon}</div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck={false}
                placeholder={placeholder}
                autoComplete="off"
                autoFocus={autofocus}
            />
            <div className="status">
                {input && (
                    <span onClick={(e) => setInput("")}>
                        <FaTimes />
                    </span>
                )}
            </div>
        </div>
    );
};

export default Input;

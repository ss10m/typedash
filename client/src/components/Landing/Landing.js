// Libraries & utils
import { useEffect, useState } from "react";
import classNames from "classnames";

// Redux
import { useDispatch } from "react-redux";
import { login } from "store/actions";

// Components
import Input from "./Input/Input";
import InputChecker from "./InputChecker/InputChecker";
import Spinner from "../Spinner/Spinner";

// SCSS
import "./Landing.scss";

const Landing = () => {
    return (
        <div className="landing-wrapper">
            <div className="landing">
                <Header />
                <View />
            </div>
        </div>
    );
};

const Header = () => {
    return (
        <div className="header">
            <div>WELCOME TO</div>
            <div className="title">
                TYPE<span>DASH</span>
            </div>
        </div>
    );
};

const View = () => {
    const [view, setView] = useState("");
    const [username, setUsername] = useState({ value: "czelo2", valid: true });

    useEffect(() => {
        console.log("FETCH NAME");
        setTimeout(() => {
            setView("guest");
        }, 20);
    }, []);

    switch (view) {
        case "guest":
            return (
                <GuestLogin setView={setView} username={username} setUsername={setUsername} />
            );
        case "login":
            return <Login setView={setView} />;
        case "register":
            return <Register setView={setView} />;
        default:
            return (
                <div className="loading">
                    <Spinner />
                </div>
            );
    }
};

const GuestLogin = ({ setView, username, setUsername }) => {
    const dispatch = useDispatch();

    return (
        <>
            <div className="guest-login">
                <div className="title">Create a temporary account</div>
                <InputChecker
                    type="username"
                    placeholder="Username"
                    initialValue={username}
                    setCurrentInput={setUsername}
                />
                <button
                    className={classNames("button", {
                        disabled: !username.valid,
                    })}
                    onClick={() => dispatch(login())}
                >
                    <span>JOIN</span>
                </button>
            </div>
            <div className="account-buttons">
                <div>
                    Already have an account?
                    <button onClick={() => setView("login")}>SIGN IN</button>
                </div>
                <div>
                    Need a new account?
                    <button className="register" onClick={() => setView("register")}>
                        REGISTER
                    </button>
                </div>
            </div>
        </>
    );
};

const Login = ({ setView }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const isDisabled = [username, password].some((input) => !input);

    return (
        <>
            <div className="landing-width">
                <Input
                    id="username"
                    placeholder="Username"
                    input={username}
                    setInput={setUsername}
                    autofocus
                />
                <Input
                    id="password"
                    placeholder="Password"
                    input={password}
                    setInput={setPassword}
                />
            </div>
            <NavButtons name="LOGIN" setView={setView} isDisabled={isDisabled} />
        </>
    );
};

const Register = ({ setView }) => {
    const [username, setUsername] = useState({ value: "", valid: false });
    const [email, setEmail] = useState({ value: "", valid: false });
    const [password, setPassword] = useState({ value: "", valid: false });
    const [confirmPassword, setConfirmPassword] = useState({ value: "", valid: false });
    const isDisabled = [username, email, password, confirmPassword].some(
        (input) => !input.valid
    );

    return (
        <>
            <div className="landing-width">
                <InputChecker
                    type="username"
                    placeholder="Username"
                    initialValue={username}
                    setCurrentInput={setUsername}
                    margin
                />
                <InputChecker
                    type="email"
                    placeholder="Email"
                    initialValue={email}
                    setCurrentInput={setEmail}
                    margin
                />
                <InputChecker
                    type="password"
                    placeholder="Password"
                    initialValue={password}
                    setCurrentInput={setPassword}
                    margin
                />
                <InputChecker
                    type="password"
                    placeholder="Confirm Password"
                    initialValue={confirmPassword}
                    setCurrentInput={setConfirmPassword}
                    confirm={password.value}
                    margin
                />
            </div>
            <NavButtons name="REGISTER" setView={setView} isDisabled={isDisabled} />
        </>
    );
};

const NavButtons = ({ name, setView, isDisabled }) => {
    return (
        <div className="landing-buttons">
            <button className={classNames("button", { disabled: isDisabled })}>
                <span>{name}</span>
            </button>
            <button className="button cancel" onClick={() => setView("guest")}>
                <span>CANCEL</span>
            </button>
        </div>
    );
};

export default Landing;

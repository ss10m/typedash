// Libraries & utils
import { useEffect, useState, useRef } from "react";
import classNames from "classnames";

// Redux
import { useDispatch } from "react-redux";
import { login, register } from "store/actions";

// Components
import Input from "../Input/Input";
import InputChecker from "../InputChecker/InputChecker";
import Spinner from "../Spinner/Spinner";

// Constants
import { TEST_TYPE, FIELD_TYPE } from "helpers/constants";

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
    //const dispatch = useDispatch();

    return (
        <>
            <div className="guest-login">
                <div className="title">Create a temporary account</div>
                <InputChecker
                    test={TEST_TYPE.AVAILABLE}
                    type={FIELD_TYPE.USERNAME}
                    placeholder="Username"
                    initial={username}
                    setIsValid={setUsername}
                    margin={false}
                />
                <button
                    className={classNames("button", {
                        disabled: !username.valid,
                    })}
                    onClick={() => console.log("guest login")}
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
    const dispatch = useDispatch();
    const [username, setUsername] = useState({ value: "", valid: false });
    const [password, setPassword] = useState({ value: "", valid: false });
    const [credentials, setCredentials] = useState({ valid: true, msg: "" });
    const [isFetching, setIsFetching] = useState(false);
    const invalidField = [username, password].some((input) => !input.valid);
    const isDisabled = invalidField || !credentials.valid || isFetching;

    useEventListener("keypress", (event) => {
        if (event.code !== "Enter" || isDisabled) return;
        onSubmit();
    });

    const onSubmit = () => {
        setIsFetching(true);
        const onFailure = (msg) => {
            setCredentials({
                valid: false,
                msg,
            });
            setIsFetching(false);
        };
        const loginInfo = {
            username: username.value,
            password: password.value,
        };
        dispatch(login(loginInfo, onFailure));
    };

    return (
        <>
            <div className="landing-width">
                <InputChecker
                    test={TEST_TYPE.EXISTS}
                    type={FIELD_TYPE.USERNAME}
                    placeholder="Username"
                    initial={username}
                    setIsValid={setUsername}
                    autofocus
                />
                <Input
                    type={FIELD_TYPE.PASSWORD}
                    placeholder="Password"
                    input={password}
                    setInput={setPassword}
                    credentials={credentials}
                    setCredentials={setCredentials}
                />
                <div className="msg">{credentials.msg}</div>
            </div>
            <NavButtons
                name="LOGIN"
                setView={setView}
                isDisabled={isDisabled}
                onClick={onSubmit}
            />
        </>
    );
};

const Register = ({ setView }) => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState({ value: "", valid: false });
    const [email, setEmail] = useState({ value: "", valid: false });
    const [password, setPassword] = useState({ value: "", valid: false });
    const [confirmPassword, setConfirmPassword] = useState({ value: "", valid: false });
    const [mismatchedPasswords, setMismatchedPasswords] = useState(false);
    const [credentials, setCredentials] = useState({ valid: true, msg: "" });
    const [isFetching, setIsFetching] = useState(false);
    const invalidField = [username, email, password, confirmPassword].some(
        (input) => !input.valid
    );
    const isDisabled = invalidField || mismatchedPasswords || !credentials.valid || isFetching;

    useEffect(() => {
        setCredentials({
            valid: true,
            msg: "",
        });
    }, [username, email, password, confirmPassword]);

    useEffect(() => {
        if (password.value && password.value !== confirmPassword.value) {
            setMismatchedPasswords(true);
        } else {
            setMismatchedPasswords(false);
        }
    }, [password, confirmPassword]);

    useEventListener("keypress", (event) => {
        if (event.code !== "Enter" || isDisabled) return;
        onSubmit();
    });

    const onSubmit = () => {
        setIsFetching(true);
        const onFailure = (msg) => {
            setCredentials({
                valid: false,
                msg,
            });
            setIsFetching(false);
        };
        const loginInfo = {
            username: username.value,
            email: email.value,
            password: password.value,
            confirmPassword: confirmPassword.value,
        };
        dispatch(register(loginInfo, onFailure));
    };

    return (
        <>
            <div className="landing-width">
                <InputChecker
                    test={TEST_TYPE.AVAILABLE}
                    type={FIELD_TYPE.USERNAME}
                    placeholder="Username"
                    initial={username}
                    setIsValid={setUsername}
                    autofocus
                />
                <InputChecker
                    type={FIELD_TYPE.EMAIL}
                    placeholder="Email"
                    initial={email}
                    setIsValid={setEmail}
                />
                <InputChecker
                    type={FIELD_TYPE.PASSWORD}
                    placeholder="Password"
                    initial={password}
                    setIsValid={setPassword}
                />
                <InputChecker
                    type={FIELD_TYPE.PASSWORD}
                    placeholder="Confirm Password"
                    initial={confirmPassword}
                    setIsValid={setConfirmPassword}
                    invalid={mismatchedPasswords}
                />
                <div className="msg">{credentials.msg}</div>
            </div>
            <NavButtons
                name="REGISTER"
                setView={setView}
                isDisabled={isDisabled}
                onClick={onSubmit}
            />
        </>
    );
};

const NavButtons = ({ name, setView, isDisabled, onClick }) => {
    return (
        <div className="landing-buttons">
            <button
                className={classNames("button", { disabled: isDisabled })}
                onClick={onClick}
            >
                <span>{name}</span>
            </button>
            <button className="button cancel" onClick={() => setView("guest")}>
                <span>CANCEL</span>
            </button>
        </div>
    );
};

const useEventListener = (eventName, handler, element = window) => {
    const savedHandler = useRef();

    useEffect(() => {
        savedHandler.current = handler;
    }, [handler]);

    useEffect(() => {
        const isSupported = element && element.addEventListener;
        if (!isSupported) return;

        const eventListener = (event) => savedHandler.current(event);
        element.addEventListener(eventName, eventListener);

        return () => {
            element.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element]);
};

export default Landing;

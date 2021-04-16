// Libraries & utils
import { useEffect, useState } from "react";

// Redux
import { useDispatch } from "react-redux";
import { login, loginAsGuest, register } from "store/actions";

// Hooks
import { useEventListener } from "hooks";

// Components
import Input from "../Input/Input";
import InputChecker from "../InputChecker/InputChecker";
import Spinner from "../Spinner/Spinner";

// Constants
import { TEST_TYPE, FIELD_TYPE } from "helpers/constants";

// Styles
import * as Styles from "./styles";

const Landing = () => {
    return (
        <Styles.Wrapper>
            <Styles.Landing>
                <Header />
                <View />
            </Styles.Landing>
        </Styles.Wrapper>
    );
};

const Header = () => {
    return (
        <Styles.Header>
            <p>WELCOME TO</p>
            <p>
                TYPE<span>DASH</span>
            </p>
        </Styles.Header>
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
                <Styles.Loading>
                    <Spinner />
                </Styles.Loading>
            );
    }
};

const GuestLogin = ({ setView, username, setUsername }) => {
    const dispatch = useDispatch();
    const [isFetching, setIsFetching] = useState(false);
    const isDisabled = !username.valid || isFetching;

    useEventListener("keydown", (event) => {
        if (!isDisabled && event.code === "Enter") onSubmit();
    });

    const onSubmit = () => {
        setIsFetching(true);
        const userInfo = { username: username.value };
        const onFailure = () => {
            setIsFetching(false);
            setUsername((current) => ({ ...current, valid: false }));
        };
        dispatch(loginAsGuest(userInfo, onFailure));
    };

    return (
        <>
            <Styles.GuestLogin>
                <p>Create a temporary account</p>
                <InputChecker
                    test={TEST_TYPE.AVAILABLE}
                    type={FIELD_TYPE.USERNAME}
                    placeholder="Username"
                    initial={username}
                    setIsValid={setUsername}
                    invalid={!username.valid}
                    margin={false}
                    isDisabled={isFetching}
                />
                <Styles.Button onClick={onSubmit} $disabled={isDisabled}>
                    <span>JOIN</span>
                </Styles.Button>
            </Styles.GuestLogin>
            <Styles.Navigation>
                <div>
                    Already have an account?
                    <button onClick={() => setView("login")}>SIGN IN</button>
                </div>
                <div>
                    Need a new account?
                    <button onClick={() => setView("register")}>REGISTER</button>
                </div>
            </Styles.Navigation>
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

    useEffect(() => {
        setCredentials({
            valid: true,
            msg: "",
        });
    }, [username]);

    useEventListener("keydown", (event) => {
        if (event.code === "Escape") return setView("guest");
        if (!isDisabled && event.code === "Enter") onSubmit();
    });

    const onSubmit = () => {
        setIsFetching(true);
        const loginInfo = {
            username: username.value,
            password: password.value,
        };
        const onFailure = (msg) => {
            setCredentials({
                valid: false,
                msg,
            });
            setIsFetching(false);
        };
        dispatch(login(loginInfo, onFailure));
    };

    return (
        <>
            <Styles.InputFields>
                <InputChecker
                    test={TEST_TYPE.EXISTS}
                    type={FIELD_TYPE.USERNAME}
                    placeholder="Username"
                    initial={username}
                    setIsValid={setUsername}
                    isDisabled={isFetching}
                    autofocus
                />
                <Input
                    type={FIELD_TYPE.PASSWORD}
                    placeholder="Password"
                    input={password}
                    setInput={setPassword}
                    credentials={credentials}
                    setCredentials={setCredentials}
                    isDisabled={isFetching}
                />
                <Styles.ErrorMsg>{credentials.msg}</Styles.ErrorMsg>
            </Styles.InputFields>
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

    useEventListener("keydown", (event) => {
        if (event.code === "Escape") return setView("guest");
        if (!isDisabled && event.code === "Enter") onSubmit();
    });

    const onSubmit = () => {
        setIsFetching(true);
        const loginInfo = {
            username: username.value,
            email: email.value,
            password: password.value,
            confirmPassword: confirmPassword.value,
        };
        const onFailure = (msg) => {
            setCredentials({
                valid: false,
                msg,
            });
            setIsFetching(false);
        };
        dispatch(register(loginInfo, onFailure));
    };

    return (
        <>
            <Styles.InputFields>
                <InputChecker
                    test={TEST_TYPE.AVAILABLE}
                    type={FIELD_TYPE.USERNAME}
                    placeholder="Username"
                    initial={username}
                    setIsValid={setUsername}
                    isDisabled={isFetching}
                    autofocus
                />
                <InputChecker
                    type={FIELD_TYPE.EMAIL}
                    placeholder="Email"
                    initial={email}
                    setIsValid={setEmail}
                    isDisabled={isFetching}
                />
                <InputChecker
                    type={FIELD_TYPE.PASSWORD}
                    placeholder="Password"
                    initial={password}
                    setIsValid={setPassword}
                    isDisabled={isFetching}
                />
                <InputChecker
                    type={FIELD_TYPE.PASSWORD}
                    placeholder="Confirm Password"
                    initial={confirmPassword}
                    setIsValid={setConfirmPassword}
                    invalid={mismatchedPasswords}
                    isDisabled={isFetching}
                />
                <Styles.ErrorMsg>{credentials.msg}</Styles.ErrorMsg>
            </Styles.InputFields>
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
        <Styles.Buttons>
            <Styles.Button onClick={onClick} $disabled={isDisabled} $primary>
                <span>{name}</span>
            </Styles.Button>
            <Styles.Button onClick={() => setView("guest")} $cancel>
                <span>CANCEL</span>
            </Styles.Button>
        </Styles.Buttons>
    );
};

export default Landing;

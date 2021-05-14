// Libraries & utils
import { useEffect, useState } from "react";

// Redux
import { useDispatch } from "react-redux";
import { generateUsername, login, loginAsGuest, register } from "store/actions";

// Components
import Input from "../Input/Input";
import InputChecker from "../InputChecker/InputChecker";
import Checkmark from "../Checkmark/Checkmark";

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
    const dispatch = useDispatch();
    const [view, setView] = useState("");
    const [username, setUsername] = useState({ value: "", valid: false });
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        setIsValid(true);
    }, [username]);

    useEffect(() => {
        const onSuccess = (username) => {
            setUsername({ value: username, valid: true });
            setView("guest");
        };
        const onFailure = () => {
            setView("guest");
        };
        dispatch(generateUsername(onSuccess, onFailure));
    }, [dispatch]);

    switch (view) {
        case "guest":
            return (
                <GuestLogin
                    setView={setView}
                    username={username}
                    setUsername={setUsername}
                    isValid={isValid}
                    setIsValid={setIsValid}
                />
            );
        case "login":
            return <Login setView={setView} />;
        case "register":
            return <Register setView={setView} />;
        case "checkmark":
            return (
                <Styles.Body>
                    <Checkmark />
                </Styles.Body>
            );
        default:
            return null;
    }
};

const GuestLogin = ({ setView, username, setUsername, isValid, setIsValid }) => {
    const dispatch = useDispatch();
    const [isChecking, setIsChecking] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const isDisabled = submitted || isChecking || !isValid || !username.valid;

    const onSubmit = (event) => {
        event.preventDefault();

        if (isDisabled) return;
        setSubmitted(true);

        const userInfo = { username: username.value };
        const onSuccess = () => {
            setView("checkmark");
        };
        const onFailure = (processed) => {
            if (processed) setIsValid(false);
            setSubmitted(false);
        };
        dispatch(loginAsGuest(userInfo, onSuccess, onFailure));
    };

    return (
        <>
            <Styles.GuestLogin onSubmit={onSubmit}>
                <p>Create a temporary account</p>
                <InputChecker
                    test={TEST_TYPE.AVAILABLE}
                    type={FIELD_TYPE.USERNAME}
                    placeholder="Username"
                    initial={username}
                    invalid={!isValid}
                    setIsValid={setUsername}
                    setIsChecking={setIsChecking}
                    isDisabled={submitted}
                    margin={false}
                />
                <Styles.Button type="submit" $disabled={isDisabled}>
                    <span>PLAY</span>
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

    const onSubmit = (event) => {
        event.preventDefault();

        if (isDisabled) return;
        setIsFetching(true);

        const loginInfo = {
            username: username.value,
            password: password.value,
        };
        const onSuccess = () => {
            setView("checkmark");
        };
        const onFailure = (msg) => {
            if (msg) {
                setCredentials({
                    valid: false,
                    msg,
                });
            }
            setIsFetching(false);
        };
        dispatch(login(loginInfo, onSuccess, onFailure));
    };

    return (
        <Styles.Form onSubmit={onSubmit}>
            <span />
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
            <NavButtons name="LOGIN" setView={setView} isDisabled={isDisabled} />
        </Styles.Form>
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

    const onSubmit = (event) => {
        event.preventDefault();

        if (isDisabled) return;
        setIsFetching(true);

        const loginInfo = {
            username: username.value,
            email: email.value,
            password: password.value,
            confirmPassword: confirmPassword.value,
        };
        const onSuccess = () => {
            setView("checkmark");
        };
        const onFailure = (msg) => {
            if (msg) {
                setCredentials({
                    valid: false,
                    msg,
                });
            }
            setIsFetching(false);
        };
        dispatch(register(loginInfo, onSuccess, onFailure));
    };

    return (
        <Styles.Form onSubmit={onSubmit}>
            <span />
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
            <NavButtons name="REGISTER" setView={setView} isDisabled={isDisabled} />
        </Styles.Form>
    );
};

const NavButtons = ({ name, setView, isDisabled }) => {
    return (
        <Styles.Buttons>
            <Styles.Button type="submit" $disabled={isDisabled} $primary>
                <span>{name}</span>
            </Styles.Button>
            <Styles.Button type="reset" onClick={() => setView("guest")} $cancel>
                <span>CANCEL</span>
            </Styles.Button>
        </Styles.Buttons>
    );
};

export default Landing;

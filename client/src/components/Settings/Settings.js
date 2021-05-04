// Libraries & utils
import React, { forwardRef, useState, useEffect } from "react";

// Redux
import { useDispatch } from "react-redux";
import { changeUsername, verifyPassword, changePassword } from "store/actions";

// Icons
import { MdClose } from "react-icons/md";

// Constants
import { TEST_TYPE, FIELD_TYPE } from "helpers/constants";

// Components
import withClickWatcher from "components/withClickWatcher/withClickWatcher";
import Input from "components/Input/Input";
import InputChecker from "components/InputChecker/InputChecker";
import Checkmark from "components/Checkmark/Checkmark";

// Styles
import * as Styles from "./styles";

const Settings = ({ hide }) => {
    useEffect(() => {
        const scrollY = window.pageYOffset;
        document.body.style.position = "fixed";
        document.body.style.top = `-${scrollY}px`;

        return () => {
            document.body.style.position = "";
            document.body.style.top = "";
            window.scrollTo(0, scrollY);
        };
    }, []);

    return (
        <Styles.Background>
            <Styles.Wrapper>
                <Modal hide={hide} />
            </Styles.Wrapper>
        </Styles.Background>
    );
};

const Modal = withClickWatcher(
    forwardRef((props, ref) => {
        const { isVisible, hide } = props;
        const [completed, setCompleted] = useState(false);

        useEffect(() => {
            if (!isVisible) hide();
        }, [isVisible, hide]);

        return (
            <Styles.Modal>
                <Styles.Settings ref={ref}>
                    <Styles.Header>
                        <p>SETTINGS</p>
                        <span onClick={hide}>
                            <MdClose />
                        </span>
                    </Styles.Header>
                    {completed ? (
                        <Styles.IconWrapper>
                            <Checkmark diameter={160} close={hide} />
                        </Styles.IconWrapper>
                    ) : (
                        <>
                            <UsernameChanger
                                completed={completed}
                                setCompleted={setCompleted}
                            />
                            <PasswordChanger
                                completed={completed}
                                setCompleted={setCompleted}
                            />
                        </>
                    )}
                </Styles.Settings>
            </Styles.Modal>
        );
    })
);

const UsernameChanger = ({ completed, setCompleted }) => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState({ value: "", valid: false });
    const [isChecking, setIsChecking] = useState(false);
    const [isValid, setIsValid] = useState(true);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        setIsValid(true);
    }, [username]);

    const onSubmit = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setSubmitted(true);
        const userInfo = { username: username.value };
        const onSuccess = () => {
            setCompleted(true);
        };
        const onFailure = (invalidUsername) => {
            if (invalidUsername) setIsValid(false);
            setSubmitted(false);
        };
        dispatch(changeUsername(userInfo, onSuccess, onFailure));
    };

    let msg = { text: "CHECK USERNAME AVAILABILITY", color: "gold" };
    if (isChecking) {
        msg = { text: "CHECKING...", color: "gold" };
    } else if (!isValid || (username.value && !username.valid)) {
        msg = { text: "USERNAME IS NOT AVAILABLE", color: "red" };
    } else if (username.value && username.valid) {
        msg = { text: "USERNAME IS AVAILABLE", color: "green" };
    }

    const disabled = submitted || completed || isChecking || !isValid || !username.valid;

    return (
        <form onSubmit={onSubmit}>
            <Styles.ChangerHeader>
                <p>CHANGE YOUR USERNAME</p>
                <Styles.Button type="submit" disabled={disabled}>
                    SAVE
                </Styles.Button>
            </Styles.ChangerHeader>
            <InputChecker
                test={TEST_TYPE.AVAILABLE}
                type={FIELD_TYPE.USERNAME}
                placeholder="Username"
                initial={username}
                invalid={!isValid}
                setIsValid={setUsername}
                setIsChecking={setIsChecking}
                isDisabled={submitted || completed}
            />
            <Styles.Message $color={msg.color}>{msg.text}</Styles.Message>
        </form>
    );
};

const PasswordChanger = ({ completed, setCompleted }) => {
    const [verifiedPassword, setVerifiedPassword] = useState("");

    return verifiedPassword ? (
        <PasswordSetter
            verifiedPassword={verifiedPassword}
            completed={completed}
            setCompleted={setCompleted}
        />
    ) : (
        <PasswordVerifier setVerifiedPassword={setVerifiedPassword} />
    );
};

const PasswordVerifier = ({ setVerifiedPassword }) => {
    const dispatch = useDispatch();
    const [password, setPassword] = useState({ value: "", valid: false });
    const [credentials, setCredentials] = useState({ valid: true, msg: "" });
    const [submitted, setSubmitted] = useState(false);

    const onSubmit = (event) => {
        event.stopPropagation();
        event.preventDefault();

        if (submitted) return;
        setSubmitted(true);

        const userInfo = { password: password.value };
        const onSuccess = () => {
            setVerifiedPassword(password.value);
        };
        const onFailure = (invalidUsername) => {
            if (invalidUsername) setCredentials({ valid: false, msg: "INCORRECT PASSWORD" });
            setSubmitted(false);
        };

        dispatch(verifyPassword(userInfo, onSuccess, onFailure));
    };

    const disabled = submitted || !password.valid || !credentials.valid;

    return (
        <form onSubmit={onSubmit}>
            <Styles.ChangerHeader>
                <p>CHANGE YOUR PASSWORD</p>
                <Styles.Button type="submit" disabled={disabled}>
                    VERIFY
                </Styles.Button>
            </Styles.ChangerHeader>
            <Input
                type={FIELD_TYPE.PASSWORD}
                placeholder="Current Password"
                input={password}
                setInput={setPassword}
                credentials={credentials}
                setCredentials={setCredentials}
                isDisabled={submitted}
            />
            {credentials && <Styles.Message $color={"red"}>{credentials.msg}</Styles.Message>}
        </form>
    );
};

const PasswordSetter = ({ verifiedPassword, completed, setCompleted }) => {
    const dispatch = useDispatch();
    const [password, setPassword] = useState({ value: "", valid: false });
    const [confirmPassword, setConfirmPassword] = useState({ value: "", valid: false });
    const [isChecking, setIsChecking] = useState(false);
    const [mismatchedPasswords, setMismatchedPasswords] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (password.value && password.value !== confirmPassword.value) {
            setMismatchedPasswords(true);
        } else {
            setMismatchedPasswords(false);
        }
    }, [password, confirmPassword]);

    const onSubmit = (event) => {
        event.stopPropagation();
        event.preventDefault();

        if (submitted) return;
        setSubmitted(true);

        const userInfo = { password: verifiedPassword, newPassword: password.value };
        const onSuccess = () => {
            setCompleted(true);
        };
        const onFailure = () => {
            setSubmitted(false);
        };
        dispatch(changePassword(userInfo, onSuccess, onFailure));
    };

    const disabled =
        submitted ||
        completed ||
        isChecking ||
        mismatchedPasswords ||
        !password.valid ||
        !confirmPassword.valid;

    return (
        <form onSubmit={onSubmit}>
            <Styles.ChangerHeader>
                <p>CHANGE YOUR PASSWORD</p>
                <Styles.Button type="submit" disabled={disabled}>
                    SAVE
                </Styles.Button>
            </Styles.ChangerHeader>
            <InputChecker
                type={FIELD_TYPE.PASSWORD}
                placeholder="New Password"
                initial={password}
                setIsValid={setPassword}
                setIsChecking={setIsChecking}
                isDisabled={submitted || completed}
            />
            <InputChecker
                type={FIELD_TYPE.PASSWORD}
                placeholder="Confirm New Password"
                initial={confirmPassword}
                setIsValid={setConfirmPassword}
                invalid={mismatchedPasswords}
                setIsChecking={setIsChecking}
                isDisabled={submitted || completed}
            />
        </form>
    );
};

export default Settings;

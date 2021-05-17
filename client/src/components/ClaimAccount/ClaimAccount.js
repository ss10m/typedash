// Libraries & utils
import React, { forwardRef, useState, useEffect } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { claimAccount } from "store/actions";

// Hooks
import { useEventListener } from "hooks";

// Components
import InputChecker from "../InputChecker/InputChecker";
import Checkmark from "components/Checkmark/Checkmark";
import withClickWatcher from "components/withClickWatcher/withClickWatcher";

// Constants
import { TEST_TYPE, FIELD_TYPE } from "helpers/constants";

// Styles
import * as Styled from "./styles";

const ClaimAccount = ({ hide }) => {
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
        <Styled.Background>
            <Styled.Wrapper>
                <Modal hide={hide} />
            </Styled.Wrapper>
        </Styled.Background>
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
            <Styled.Modal ref={ref}>
                <Styled.Header>
                    <div>
                        TYPE<span>DASH</span>
                    </div>
                    <div>CLAIM ACCOUNT</div>
                </Styled.Header>
                <Styled.Body $center={completed}>
                    {completed ? (
                        <Checkmark diameter={160} close={hide} />
                    ) : (
                        <Inputs setCompleted={setCompleted} hide={hide} />
                    )}
                </Styled.Body>
            </Styled.Modal>
        );
    })
);

const Inputs = ({ setCompleted, hide }) => {
    const dispatch = useDispatch();
    const currentUsername = useSelector((state) => state.session.user.displayName);
    const [submitted, setSubmitted] = useState(false);
    const [username, setUsername] = useState({ value: currentUsername, valid: true });
    const [email, setEmail] = useState({ value: "", valid: false });
    const [password, setPassword] = useState({ value: "", valid: false });
    const [confirmPassword, setConfirmPassword] = useState({ value: "", valid: false });
    const [mismatchedPasswords, setMismatchedPasswords] = useState(false);

    const isDisabled =
        submitted ||
        mismatchedPasswords ||
        [username, email, password, confirmPassword].some((input) => !input.valid);

    useEffect(() => {
        if (password.value && password.value !== confirmPassword.value) {
            setMismatchedPasswords(true);
        } else {
            setMismatchedPasswords(false);
        }
    }, [password, confirmPassword]);

    useEventListener("keydown", (event) => {
        if (event.keyCode === 27) {
            hide();
        } else if (event.keyCode === 13) {
            claim();
        }
    });

    const claim = () => {
        if (isDisabled) return;
        setSubmitted(true);

        const userInfo = {
            username: username.value,
            email: email.value,
            password: password.value,
            confirmPassword: confirmPassword.value,
        };
        const onSuccess = () => {
            setCompleted(true);
        };
        const onFailure = () => {
            setSubmitted(false);
        };
        dispatch(claimAccount(userInfo, onSuccess, onFailure));
    };

    return (
        <>
            <div>
                <InputChecker
                    test={TEST_TYPE.AVAILABLE_OR_CURRENT}
                    type={FIELD_TYPE.USERNAME}
                    placeholder="Username"
                    initial={username}
                    setIsValid={setUsername}
                    isDisabled={submitted}
                />
                <InputChecker
                    type={FIELD_TYPE.EMAIL}
                    placeholder="Email"
                    initial={email}
                    setIsValid={setEmail}
                    isDisabled={submitted}
                    autofocus
                />
                <InputChecker
                    type={FIELD_TYPE.PASSWORD}
                    placeholder="Password"
                    initial={password}
                    setIsValid={setPassword}
                    isDisabled={submitted}
                />
                <InputChecker
                    type={FIELD_TYPE.PASSWORD}
                    placeholder="Confirm Password"
                    initial={confirmPassword}
                    setIsValid={setConfirmPassword}
                    invalid={mismatchedPasswords}
                    isDisabled={submitted}
                />
            </div>
            <NavButtons name="claim" claim={claim} hide={hide} isDisabled={isDisabled} />
        </>
    );
};

const NavButtons = ({ name, claim, hide, isDisabled }) => {
    return (
        <div>
            <Styled.Button onClick={claim} $disabled={isDisabled} $primary>
                <span>{name.toUpperCase()}</span>
            </Styled.Button>
            <Styled.Button onClick={hide} $cancel>
                <span>CANCEL</span>
            </Styled.Button>
        </div>
    );
};
export default ClaimAccount;

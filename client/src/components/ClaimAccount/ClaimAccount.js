// Libraries & utils
import React, { forwardRef, useState, useEffect } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { claimAccount, hideClaimAccount } from "store/actions";

import InputChecker from "../InputChecker/InputChecker";

// Constants
import { TEST_TYPE, FIELD_TYPE } from "helpers/constants";

// Components
import Checkmark from "components/Checkmark/Checkmark";
import withClickWatcher from "components/withClickWatcher/withClickWatcher";

// Styles
import * as Styles from "./styles";

const ClaimAccount = () => {
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
                <Modal />
            </Styles.Wrapper>
        </Styles.Background>
    );
};

const Modal = withClickWatcher(
    forwardRef((props, ref) => {
        const { isVisible } = props;
        const dispatch = useDispatch();
        const [completed, setCompleted] = useState(false);

        useEffect(() => {
            if (!isVisible) dispatch(hideClaimAccount());
        }, [dispatch, isVisible]);

        return (
            <Styles.Modal ref={ref}>
                <Styles.Header>
                    <div>
                        TYPE<span>DASH</span>
                    </div>
                    <div>CLAIM ACCOUNT</div>
                </Styles.Header>
                <Styles.Body $center={completed}>
                    {completed ? (
                        <Checkmark diameter={160} close={() => dispatch(hideClaimAccount())} />
                    ) : (
                        <Inputs setCompleted={setCompleted} />
                    )}
                </Styles.Body>
            </Styles.Modal>
        );
    })
);

const Inputs = ({ setCompleted }) => {
    const dispatch = useDispatch();
    const currentUsername = useSelector((state) => state.session.user.username);
    const [submitted, setSubmitted] = useState(false);
    const [username, setUsername] = useState({ value: currentUsername, valid: true });
    const [email, setEmail] = useState({ value: "", valid: false });
    const [password, setPassword] = useState({ value: "", valid: false });
    const [confirmPassword, setConfirmPassword] = useState({ value: "", valid: false });
    const [mismatchedPasswords, setMismatchedPasswords] = useState(false);

    const claim = () => {
        if (submitted) return;
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

    useEffect(() => {
        setSubmitted(false);
    }, [username, email, password, confirmPassword, setSubmitted]);

    return (
        <>
            <div>
                <InputChecker
                    test={TEST_TYPE.AVAILABLE}
                    type={FIELD_TYPE.USERNAME}
                    placeholder="Username"
                    initial={username}
                    setIsValid={setUsername}
                />
                <InputChecker
                    type={FIELD_TYPE.EMAIL}
                    placeholder="Email"
                    initial={email}
                    setIsValid={setEmail}
                    autofocus
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
            </div>
            <NavButtons name="claim" claim={claim} isDisabled={isDisabled} />
        </>
    );
};

const NavButtons = ({ name, claim, isDisabled }) => {
    const dispatch = useDispatch();
    return (
        <div>
            <Styles.Button onClick={claim} $disabled={isDisabled} $primary>
                <span>{name.toUpperCase()}</span>
            </Styles.Button>
            <Styles.Button onClick={() => dispatch(hideClaimAccount())} $cancel>
                <span>CANCEL</span>
            </Styles.Button>
        </div>
    );
};

export default ClaimAccount;

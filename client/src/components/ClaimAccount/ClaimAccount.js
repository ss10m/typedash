// Libraries & utils
import React, { forwardRef, useState, useEffect } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { hideClaimAccount } from "store/actions";

import InputChecker from "../InputChecker/InputChecker";

// Constants
import { TEST_TYPE, FIELD_TYPE } from "helpers/constants";

// Components
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

        useEffect(() => {
            if (!isVisible) dispatch(hideClaimAccount());
        }, [dispatch, isVisible]);

        return (
            <Styles.Modal ref={ref}>
                <Header />
                <Register />
            </Styles.Modal>
        );
    })
);

const Header = () => {
    return (
        <Styles.Header>
            <div>
                TYPE<span>DASH</span>
            </div>
            <div>CLAIM ACCOUNT</div>
        </Styles.Header>
    );
};

const Register = () => {
    const currentUsername = useSelector((state) => state.session.user.username);
    const [username, setUsername] = useState({ value: currentUsername, valid: true });
    const [email, setEmail] = useState({ value: "", valid: false });
    const [password, setPassword] = useState({ value: "", valid: false });
    const [confirmPassword, setConfirmPassword] = useState({ value: "", valid: false });
    const [mismatchedPasswords, setMismatchedPasswords] = useState(false);
    const isDisabled =
        [username, email, password, confirmPassword].some((input) => !input.valid) ||
        mismatchedPasswords;

    useEffect(() => {
        if (password.value && password.value !== confirmPassword.value) {
            setMismatchedPasswords(true);
        } else {
            setMismatchedPasswords(false);
        }
    }, [password, confirmPassword]);

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
            <NavButtons name="CLAIM" isDisabled={isDisabled} />
        </>
    );
};

const NavButtons = ({ name, isDisabled }) => {
    const dispatch = useDispatch();
    return (
        <Styles.Buttons>
            <Styles.Button $disabled={isDisabled} $primary>
                <span>{name}</span>
            </Styles.Button>
            <Styles.Button onClick={() => dispatch(hideClaimAccount())} $cancel>
                <span>CANCEL</span>
            </Styles.Button>
        </Styles.Buttons>
    );
};

export default ClaimAccount;

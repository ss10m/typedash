// Libraries & utils
import React, { forwardRef, useState, useEffect } from "react";
import classNames from "classnames";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { hideClaimAccount } from "store/actions";

import InputChecker from "../InputChecker/InputChecker";

// SCSS
import "./ClaimAccount.scss";

// Constants
import { TEST_TYPE, FIELD_TYPE } from "helpers/constants";

import withClickWatcher from "../Modal/Modal";

const ClaimAccount = () => {
    return (
        <div className="claim-account-wrapper">
            <Inside />
        </div>
    );
};

const Inside = withClickWatcher(
    forwardRef((props, ref) => {
        const { isVisible } = props;
        const dispatch = useDispatch();

        useEffect(() => {
            if (!isVisible) dispatch(hideClaimAccount());
        }, [dispatch, isVisible]);

        return (
            <div className="claim-account" ref={ref}>
                <Header />
                <Register />
            </div>
        );
    })
);

const Header = () => {
    return (
        <div className="header">
            <div className="title">
                TYPE<span>DASH</span>
            </div>
            <div>CLAIM ACCOUNT</div>
        </div>
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
            <div className="landing-width">
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
        <div className="landing-buttons">
            <button className={classNames("button", { disabled: isDisabled })}>
                <span>{name}</span>
            </button>
            <button className="button cancel" onClick={() => dispatch(hideClaimAccount())}>
                <span>CANCEL</span>
            </button>
        </div>
    );
};

export default ClaimAccount;

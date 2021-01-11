// Libraries & utils
import React from "react";

// Redux
import { useDispatch } from "react-redux";
import { login } from "store/actions";

// Components
import Input from "./Input/Input";

// SCSS
import "./Landing.scss";

const Landing = () => {
    return (
        <div className="landing-wrapper">
            <div className="landing">
                <Header />
                <View />
                <AccountButtons />
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
    const dispatch = useDispatch();

    return (
        <div className="guest-login">
            <div className="title">Create a temporary account</div>
            <Input />
            <button className="button" onClick={() => dispatch(login())}>
                <span>JOIN </span>
            </button>
        </div>
    );
};

const AccountButtons = () => {
    return (
        <div className="account-buttons">
            <div>
                Already have an account? <button>SIGN IN</button>
            </div>
            <div>
                Need a new account? <button className="register">REGISTER</button>
            </div>
        </div>
    );
};

export default Landing;

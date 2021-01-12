// Libraries & utils
import { useEffect, useState } from "react";
import classNames from "classnames";

// Redux
import { useDispatch } from "react-redux";
import { login } from "store/actions";

// Components
import Input from "./Input/Input";
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
    const [username, setUsername] = useState({ username: "czelo2", valid: true });

    useEffect(() => {
        console.log("FETCH NAME");
        setTimeout(() => {
            setView("guest");
        }, 2000);
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
                <Input initialValue={username} setCurrentInput={setUsername} />
                <button
                    className={classNames("button", {
                        disabled: !username.valid || !username.username,
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
    return (
        <>
            <div className="landing-width">LOGIN</div>
            <NavButtons setView={setView} />
        </>
    );
};

const Register = ({ setView }) => {
    return (
        <>
            <div className="landing-width">REGISTER</div>
            <NavButtons setView={setView} />
        </>
    );
};

const NavButtons = ({ setView }) => {
    return (
        <div className="landing-buttons">
            <button className="button">
                <span>LOGIN</span>
            </button>
            <button className="button cancel" onClick={() => setView("guest")}>
                <span>CANCEL</span>
            </button>
        </div>
    );
};

export default Landing;

// Libraries & utils
import React, { useState, useEffect } from "react";

// Redux
import { connect } from "react-redux";
import { login, logout, loginAsGuest, register } from "store/actions";

// Icons
import { FaUser } from "react-icons/fa";

// Helpers
import { handleResponse } from "helpers";

//SCSS
import "./Login.scss";

class Login extends React.Component {
    render() {
        let { session } = this.props;

        return (
            <div className="login">
                <div className="inside">
                    <div style={{ color: "white" }}>
                        {(session.user && session.user.username) || "NO USER FOUND"}
                    </div>
                    <button onClick={this.props.login}>LOGIN</button>
                    <button onClick={this.props.loginAsGuest}>LOGIN AS GUEST</button>
                    <button onClick={this.props.register}>REGISTER</button>
                    <button onClick={this.props.logout}>LOGOUT</button>
                    <Register />
                    <Register />
                    <Register />
                    <Register />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        session: state.session,
    };
};

const mapDispatchToProps = (dispatch) => ({
    login: () => {
        dispatch(login());
    },
    loginAsGuest: () => {
        dispatch(loginAsGuest());
    },
    register: () => {
        dispatch(register());
    },
    logout: () => {
        dispatch(logout());
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);

function Register() {
    const [username, setUsername] = useState("");

    useEffect(() => {
        if (!username) return;
        const handler = setTimeout(() => {
            fetch("/api/session/check", {
                method: "POST",
                body: JSON.stringify({
                    username,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then(handleResponse)
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.log(error);
                });
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [username]);

    return (
        <div>
            <div className="input">
                <div className="icon">
                    <FaUser />
                </div>
                <div className={"field" + (username.length > 0 ? " active" : "")}>
                    <label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            spellCheck={false}
                            autoFocus={false}
                        />
                        <span className="title">Username</span>
                    </label>
                </div>
            </div>
        </div>
    );
}

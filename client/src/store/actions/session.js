import { handleResponse } from "helpers";

const getSession = () => async (dispatch) => {
    fetch("/api/session")
        .then(handleResponse)
        .then((data) => {
            let session = { isLoaded: true, user: null };
            if (data.user) session.user = data.user;
            dispatch(setSession(session));
        })
        .catch(() => {});
};

const setSession = (session) => ({
    type: "SET_SESSION",
    session,
});

const clearSession = () => ({
    type: "CLEAR_SESSION",
    handleResponse,
});

const login = (userInfo) => async (dispatch) => {
    fetch("/api/session", {
        method: "POST",
        body: JSON.stringify({
            username: "czelo",
            password: "password123",
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(handleResponse)
        .then((data) => {
            let sessionState = { isLoaded: true, user: data.user };
            dispatch(setSession(sessionState));
        })
        .catch((error) => {
            console.log(error);
            if (error.action) return; //dispatch(showLoginError(meta.message));
        });
};

const loginAsGuest = () => async (dispatch) => {
    fetch("/api/session/guest", {
        method: "POST",
    })
        .then(handleResponse)
        .then((data) => {
            let sessionState = { isLoaded: true, user: data.user };
            dispatch(setSession(sessionState));
        })
        .catch((error) => {
            console.log(error);
            if (error.action) return; //dispatch(showLoginError(meta.message));
        });
};

const claimAccount = () => async (dispatch) => {};

const register = (userInfo) => async (dispatch) => {
    fetch("/api/session/register", {
        method: "POST",
        body: JSON.stringify({
            username: "czelo2",
            email: "czelo@email.com",
            password: "password123",
            confirmPassword: "password123",
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(handleResponse)
        .then((data) => {
            let sessionState = { isLoaded: true, user: data.user };
            dispatch(setSession(sessionState));
        })
        .catch((error) => {
            console.log(error);
            if (error.action) return; //dispatch(showLoginError(meta.message));
        });
};

const logout = () => (dispatch) => {
    fetch("/api/session", { method: "DELETE" })
        .then(handleResponse)
        .then(() => dispatch(clearSession()))
        .catch(() => {});
};

export { getSession, login, loginAsGuest, claimAccount, register, logout };

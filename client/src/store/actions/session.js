import { handleResponse } from "helpers";

import socketIO from "core/SocketClient";

const getSession = () => async (dispatch) => {
    socketIO.setDispatch(dispatch);
    fetch("/api/session")
        .then(handleResponse)
        .then((data) => {
            let session = { isLoaded: true };
            if (data.user) {
                session.user = data.user;
                socketIO.connect();
            }
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
});

const login = (loginInfo, onSuccess, onFailure) => async (dispatch) => {
    fetch("/api/session", {
        method: "POST",
        body: JSON.stringify(loginInfo),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(handleResponse)
        .then((data) => {
            onSuccess();
            const sessionState = { isLoaded: true, user: data.user };
            setTimeout(() => {
                dispatch(setSession(sessionState));
                socketIO.connect();
            }, 2000);
        })
        .catch((error) => {
            onFailure(error.message);
        });
};

const loginAsGuest = (userInfo, onSuccess, onFailure) => async (dispatch) => {
    fetch("/api/session/guest", {
        method: "POST",
        body: JSON.stringify(userInfo),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(handleResponse)
        .then((data) => {
            onSuccess();
            const sessionState = { isLoaded: true, user: data.user };
            setTimeout(() => {
                dispatch(setSession(sessionState));
                socketIO.connect();
            }, 2000);
        })
        .catch(() => {
            onFailure();
        });
};

const claimAccount = (userInfo, onSuccess, onFailure) => async (dispatch) => {
    fetch("/api/session/claim", {
        method: "POST",
        body: JSON.stringify(userInfo),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(handleResponse)
        .then((data) => {
            onSuccess();
            const sessionState = { isLoaded: true, user: data.user };
            dispatch(setSession(sessionState));
        })
        .catch((msg) => {
            onFailure();
        });
};

const register = (userInfo, onSuccess, onFailure) => async (dispatch) => {
    fetch("/api/session/register", {
        method: "POST",
        body: JSON.stringify(userInfo),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(handleResponse)
        .then((data) => {
            onSuccess();
            const sessionState = { isLoaded: true, user: data.user };
            setTimeout(() => {
                dispatch(setSession(sessionState));
                socketIO.connect();
            }, 2000);
        })
        .catch((error) => {
            onFailure(error.message);
        });
};

const logout = () => (dispatch) => {
    let id = localStorage.getItem("sync-id");
    fetch("/api/session", {
        method: "DELETE",
        body: JSON.stringify({ id }),
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then(handleResponse)
        .then(() => {
            socketIO.disconnect();
            dispatch(clearSession());
        })
        .catch(() => dispatch(clearSession()));
};

export {
    setSession,
    getSession,
    clearSession,
    login,
    loginAsGuest,
    claimAccount,
    register,
    logout,
};

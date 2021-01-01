import { parseResponse, handleResponse } from "helpers";

const getSession = () => async (dispatch) => {
    fetch("/api/session")
        .then(handleResponse)
        .then((data) => {
            let session = { isLoaded: true, user: null };
            if (data.user) session.user = data.user;
            dispatch(setSession(session));
        })
        .catch(() => {
            //dispatch(setError("Something went wrong"));
        });
};

const setSession = (session) => ({
    type: "SET_SESSION",
    session,
});

const clearSession = () => ({
    type: "CLEAR_SESSION",
    handleResponse,
});

const login = () => async (dispatch) => {
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
            let sessionState = { isLoaded: true, user: data };
            dispatch(setSession(sessionState));
        })
        .catch((error) => {
            console.log(error);
            if (error.action) {
                return; //dispatch(showLoginError(meta.message));
            } else {
                //dispatch(setError("Something went wrong"));
            }
        });

    /*
    let parsed = await parseResponse(response);
    if (!parsed) return; //dispatch(setError("Something went wrong"));
    let { meta, data } = parsed;
    console.log(meta, data);
    if (!meta.ok) {
        if (meta.action) {
            return; //dispatch(showLoginError(meta.message));
        }
        return; //dispatch(setError("Something went wrong"));
    }
    let sessionState = { isLoaded: true, user: data.user };
    dispatch(setSession(sessionState));
    */
};

const loginAsGuest = () => async (dispatch) => {};

const claimAccount = () => async (dispatch) => {};

const register = (userInfo) => async (dispatch) => {};

const logout = () => async (dispatch) => {
    const response = await fetch("/api/session", { method: "DELETE" });
    let parsed = await parseResponse(response);
    if (!parsed) return; //dispatch(setError("Something went wrong"));
    let { meta } = parsed;
    if (!meta.ok) {
        return; //dispatch(setError("Something went wrong"));
    }
    dispatch(clearSession());
};

export { getSession, login, loginAsGuest, claimAccount, register, logout };

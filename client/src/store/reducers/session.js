const SET_SESSION = "SET_SESSION";
const CLEAR_SESSION = "CLEAR_SESSION";
const defaultState = { isLoaded: false, isConnected: false, user: null };

const sessionReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_SESSION:
            return { ...state, ...action.session };
        case CLEAR_SESSION:
            return { isLoaded: true, isConnected: false, user: null };
        default:
            return state;
    }
};

export default sessionReducer;

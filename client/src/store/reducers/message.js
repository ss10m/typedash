const SEND = "redux/message/SEND";
const SEND_SUCCESS = "redux/message/SEND_SUCCESS";
const SEND_FAIL = "redux/message/SEND_FAIL";

const defaultState = {
    loaded: false,
};

const reducer = (state = defaultState, action = {}) => {
    switch (action.type) {
        case SEND: {
            return {
                ...state,
                isSending: true,
            };
        }
        case SEND_SUCCESS:
            return {
                ...state,
                loading: false,
                loaded: true,
                user: action.result,
            };
        case SEND_FAIL:
            return {
                ...state,
                loading: false,
                loaded: false,
                error: action.error,
            };
        default: {
            return state;
        }
    }
};

export default reducer;

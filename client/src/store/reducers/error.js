const SET_ERROR = "SET_ERROR";

const errorReducer = (state = null, action) => {
    switch (action.type) {
        case SET_ERROR:
            return action.error;
        default:
            return state;
    }
};

export default errorReducer;

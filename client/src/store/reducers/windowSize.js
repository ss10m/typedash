const UPDATE_WINDOW_SIZE = "UPDATE_WINDOW_SIZE";

const windowSizeReducer = (state = 0, action) => {
    switch (action.type) {
        case UPDATE_WINDOW_SIZE:
            return action.width;
        default:
            return state;
    }
};

export default windowSizeReducer;

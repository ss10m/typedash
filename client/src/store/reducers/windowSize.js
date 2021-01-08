const UPDATE_WINDOW_SIZE = "UPDATE_WINDOW_SIZE";

const windowSizeReducer = (state = { width: 0, height: 0 }, action) => {
    switch (action.type) {
        case UPDATE_WINDOW_SIZE:
            return { width: action.width, height: action.height };
        default:
            return state;
    }
};

export default windowSizeReducer;

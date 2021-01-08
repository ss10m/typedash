const SET_ROOMS = "SET_ROOMS";
const CLEAR_ROOMS = "CLEAR_ROOMS";

const roomsReducer = (state = [], action) => {
    switch (action.type) {
        case SET_ROOMS:
            return [...action.rooms];
        case CLEAR_ROOMS:
            return [];
        default:
            return state;
    }
};

export default roomsReducer;

const SET_ROOM = "SET_ROOM";
const UPDATE_ROOM = "UPDATE_ROOM";
const CLEAR_ROOM = "CLEAR_ROOM";

const roomReducer = (state = null, action) => {
    switch (action.type) {
        case SET_ROOM:
            return { ...state, ...action.room };
        case UPDATE_ROOM:
            return { ...state, ...action.update };
        case CLEAR_ROOM:
            return null;
        default:
            return state;
    }
};

export default roomReducer;

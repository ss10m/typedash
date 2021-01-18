export const setRoom = (room) => ({
    type: "SET_ROOM",
    room,
});

export const updateRoom = (update) => ({
    type: "UPDATE_ROOM",
    update,
});

export const clearRoom = () => ({
    type: "CLEAR_ROOM",
});

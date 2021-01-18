import roomHandler from "./room.js";

const socket = (io) => {
    io.on("connection", (socket) => {
        roomHandler(io, socket);
    });
};

export default socket;

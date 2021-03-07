import roomHandler from "./room.js";

import { Connection } from "../core/index.js";

const socket = (io) => {
    Connection.setSocket(io);
    io.on("connection", (socket) => {
        roomHandler(io, socket);
    });
};

export default socket;

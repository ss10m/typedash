import { Connection, Room } from "../core/index.js";

import { ROOM_ACTION } from "../util/constants.js";

export default (io, socket) => {
    // Error Handlers
    if (!socket.handshake.session.user) {
        socket.emit("handle-error", "Session not found");
        return socket.disconnect();
    }

    let browserId = socket.handshake.query.id;
    if (!browserId) {
        socket.emit("handle-error", "Local Storage is not enabled");
        return socket.disconnect();
    }
    let connection = new Connection(browserId, socket.id);
    if (!connection.isValid) {
        socket.emit(
            "handle-error",
            "Reached maximum number of allowed tabs in a single browser"
        );
        return socket.disconnect();
    }

    // Lobby
    socket.on("join-lobby", () => {
        socket.join("lobby");
        socket.emit("rooms", Room.getRooms());
    });

    socket.on("refresh-lobby", () => {
        socket.emit("rooms", Room.getRooms());
    });

    socket.on("leave-lobby", () => {
        socket.leave("lobby");
    });

    // Room
    socket.on("create-room", () => {
        const room = new Room(io);
        socket.emit("room-created", room.id);
        io.in("lobby").emit("rooms", Room.getRooms());
    });

    socket.on("join-room", (roomId) => {
        const room = Room.getRoomById(roomId);
        if (!room) return socket.emit("updated-room", { error: "Room not found" });
        room.join(socket.id);
    });

    socket.on("leave-room", () => {
        const room = Room.getRoomBySocketId(socket.id);
        if (room) room.leave(socket);
    });

    socket.on("disconnect", () => {
        Connection.removeConnection(socket.id);
        const room = Room.getRoomBySocketId(socket.id);
        if (room) room.leave(socket);
    });

    socket.on("update-progress", (data) => {
        const room = Room.getRoomBySocketId(socket.id);
        if (room) room.updateProgress(socket.id, data);
    });

    socket.on("update-state", (action) => {
        const room = Room.getRoomBySocketId(socket.id);
        if (!room) return;

        switch (action) {
            case ROOM_ACTION.START_COUNTDOWN:
                room.startCountdown();
                break;
            case ROOM_ACTION.CANCEL_COUNTDOWN:
                room.cancelCountdown();
                break;
            case ROOM_ACTION.NEXT_ROUND:
                room.startNextRound();
                break;
            default:
                break;
        }
    });

    socket.on("toggle-spectate", () => {
        const room = Room.getRoomBySocketId(socket.id);
        if (!room) return;
        room.toggleSpectate(socket.id);
    });

    socket.on("toggle-play-next", (toggled) => {
        const room = Room.getRoomBySocketId(socket.id);
        if (!room) return;
        room.togglePlayNext(socket, toggled);
    });
};

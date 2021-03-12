import { Connection, Room } from "../core/index.js";

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

    socket.use((packet, next) => {
        //console.log(packet);
        //console.log("NEW PACKET");
        //console.log(socket.handshake.session.user);
        //
        //socket.disconnect();
        // if (packet[0] === "create-room") {
        //     //socket.emit("handle-error", "new instance");
        //     next();
        // } else {
        //     next();
        // }
        next();
    });

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
        room.createRoom(socket.id);
    });

    socket.on("join-room", (roomId) => {
        console.log("JOINED: " + roomId);
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

    socket.on("set-ready", (isReady) => {
        const room = Room.getRoomBySocketId(socket.id);
        if (!room) return;
        room.setPlayerReady(socket.id, isReady);
    });

    socket.on("set-spectate", (spectate) => {
        const room = Room.getRoomBySocketId(socket.id);
        if (!room) return;
        room.setSpectate(socket.id, spectate);
    });

    socket.on("set-play-next", (playNext) => {
        const room = Room.getRoomBySocketId(socket.id);
        if (!room) return;
        room.setPlayNext(socket.id, playNext);
    });

    socket.on("update-results", (resultType) => {
        const room = Room.getRoomBySocketId(socket.id);
        if (!room) return;
        room.updateResults(socket.id, resultType);
    });
};

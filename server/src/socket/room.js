import { Connection, Room } from "../core/index.js";

export default (io, socket) => {
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

    socket.emit("rooms", Room.getRooms());
    socket.join("lobby");

    socket.on("get-rooms", () => {
        socket.emit("rooms", Room.getRooms());
    });

    socket.on("create-room", () => {
        const room = new Room(socket.id);
        room.join(socket);
        socket.leave("lobby");
        socket.join(room.id);
        socket.emit("joined-room", room.getDetails());
        updateLobby(io);
    });

    socket.on("join-room", (roomId) => {
        const room = Room.getRoomById(roomId);
        if (!room) return socket.emit("rooms", Room.getRooms());

        room.join(socket);
        const updatedState = {};
        updatedState["users"] = room.getUsers();
        socket.to(room.id).emit("updated-room", updatedState);

        socket.leave("lobby");
        socket.join(room.id);
        socket.emit("joined-room", room.getDetails());
    });

    socket.on("leave-room", () => {
        let room = Room.getRoomBySocketId(socket.id);
        if (!room) return;

        const isRoomEmpty = room.leave(socket.id);
        socket.leave(room.id);
        socket.join("lobby");
        socket.emit("left-room");
        if (isRoomEmpty) return updateLobby(io);

        let updatedState = {};
        updatedState["users"] = room.getUsers();
        socket.to(room.id).emit("updated-room", updatedState);
    });

    socket.on("disconnect", () => {
        Connection.removeConnection(socket.id);
        let room = Room.getRoomBySocketId(socket.id);
        if (!room) return socket.leave("lobby");

        const isRoomEmpty = room.leave(socket.id);
        socket.leave(room.id);
        if (isRoomEmpty) return updateLobby(io);

        let updatedState = {};
        updatedState["users"] = Object.values(room.users);
        socket.to(room.id).emit("updated-room", updatedState);
    });
};

const updateLobby = (io) => {
    io.in("lobby").emit("rooms", Room.getRooms());
};

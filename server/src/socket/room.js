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

    console.log("===================================================");
    console.log(`=> ${socket.handshake.session.user.username} connected (${socket.id})`);

    console.log(Connection.browserIds);

    socket.emit("rooms", Room.getRooms());
    socket.join("lobby");

    // ==========--------------==============
    // ==========--------------==============
    // ==========--------------==============
    socket.on("get-rooms", () => {
        socket.emit("rooms", Room.getRooms());
    });

    socket.on("create-room", () => {
        console.log("create room");

        const room = new Room(socket.id);
        room.join(socket);
        socket.leave("lobby");
        socket.join(room.id);

        let roomInfo = {
            id: room.id,
            name: room.name,
            users: room.getUsers(),
        };
        console.log(roomInfo);
        socket.emit("joined-room", roomInfo);
        io.in("lobby").emit("rooms", Room.getRooms());
    });

    socket.on("join-room", (roomId) => {
        console.log("join-room: " + roomId);
        let room = Room.getRoomById(roomId);
        if (!room) return socket.emit("rooms", Room.getRooms());

        room.join(socket);
        socket.leave("lobby");
        socket.join(room.id);

        let roomInfo = {
            id: room.id,
            name: room.name,
            users: room.getUsers(),
        };
        socket.emit("joined-room", roomInfo);

        let updatedState = {};
        updatedState["users"] = Object.values(room.users);
        socket.to(room.id).emit("updated-room", updatedState);
    });

    socket.on("leave-room", () => {
        let room = Room.getRoomBySocketId(socket.id);
        if (!room) return;

        const isRoomEmpty = room.leave(socket.id);
        socket.leave(room.id);
        socket.join("lobby");
        socket.emit("left-room");
        if (isRoomEmpty) {
            console.log("EMPTY ROOM");
            return io.in("lobby").emit("rooms", Room.getRooms());
        }

        let updatedState = {};
        updatedState["users"] = Object.values(room.users);
        socket.to(room.id).emit("updated-room", updatedState);
    });

    socket.on("disconnect", () => {
        Connection.removeConnection(socket.id);
        let room = Room.getRoomBySocketId(socket.id);
        if (!room) {
            return socket.leave("lobby");
        }

        socket.leave(room.id);
        const isRoomEmpty = room.leave(socket.id);
        if (isRoomEmpty) {
            console.log("EMPTY ROOM");
            return io.in("lobby").emit("rooms", Room.getRooms());
        }
        let updatedState = {};
        updatedState["users"] = Object.values(room.users);
        socket.to(room.id).emit("updated-room", updatedState);

        console.log(
            `=> ${socket.handshake.session.user.username} disconnected (${socket.id})`
        );
        console.log(Connection.browserIds);
    });
};

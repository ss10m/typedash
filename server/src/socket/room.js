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

    socket.on("join-lobby", () => {
        console.log("join-lobby");
        socket.join("lobby");
        socket.emit("rooms", Room.getRooms());
        printLobby();
    });

    socket.on("refresh-lobby", () => {
        console.log("refresh-lobby");
        socket.emit("rooms", Room.getRooms());
    });

    socket.on("leave-lobby", () => {
        console.log("leave-lobby");
        socket.leave("lobby");
        printLobby();
    });

    socket.on("create-room", () => {
        console.log("create-room");
        const room = new Room(socket.id);
        socket.emit("room-created", room.id);
        updateLobby(io);
    });

    socket.on("join-room", (roomId) => {
        console.log("join-room: " + roomId);

        const room = Room.getRoomById(roomId);
        if (!room) {
            return socket.emit("failed-to-join", "Room not found");
        }

        room.join(socket);
        if (room.getNumOfUsers()) {
            const updatedState = {};
            updatedState.players = room.getPlayers();
            updatedState.spectators = room.getSpectators();
            socket.to(room.id).emit("updated-room", updatedState);
        }

        socket.join(room.id);
        socket.emit("joined-room", room.getDetails());
    });

    socket.on("update-status", (status) => {
        console.log("update-status");

        const room = Room.getRoomBySocketId(socket.id);
        if (!room) return;
        const player = room.players[socket.id];
        if (!player) return;

        const progress = status.progress / room.status.quoteLength;
        player.progress = Math.round(progress * 100);

        const updatedState = {};
        updatedState.players = room.getPlayers();
        io.in(room.id).emit("updated-room", updatedState);
    });

    socket.on("leave-room", () => {
        console.log("leave-room");

        const room = Room.getRoomBySocketId(socket.id);
        if (!room) return;

        const isRoomEmpty = room.leave(socket.id);
        socket.leave(room.id);
        if (isRoomEmpty) return updateLobby(io);

        let updatedState = {};
        updatedState.players = room.getPlayers();
        updatedState.spectators = room.getSpectators();
        socket.to(room.id).emit("updated-room", updatedState);
    });

    socket.on("disconnect", () => {
        console.log("disconnect");
        Connection.removeConnection(socket.id);
        const room = Room.getRoomBySocketId(socket.id);
        if (!room) return;

        const isRoomEmpty = room.leave(socket.id);
        socket.leave(room.id);
        if (isRoomEmpty) return updateLobby(io);

        let updatedState = {};
        updatedState.players = room.getPlayers();
        updatedState.spectators = room.getSpectators();
        socket.to(room.id).emit("updated-room", updatedState);

        printLobby();
    });

    const printLobby = () => {
        io.in("lobby").clients((err, clients) => {
            console.log(clients);
        });
    };
};

const updateLobby = (io) => {
    io.in("lobby").emit("rooms", Room.getRooms());
};

const socket = (io) => {
    io.on("connection", (socket) => {
        console.log("new connection");
        //console.log(socket.handshake.session);

        socket.on("hello", () => {
            console.log("SOCKET HELLO");
            socket.emit("hello");
        });

        socket.on("disconnect", () => {
            console.log("disconnected");
        });
    });
};

export default socket;

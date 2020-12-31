const socket = (io) => {
    io.on("connection", (socket) => {
        console.log("new connection");
        socket.emit("hello");

        socket.on("hello", () => {
            console.log("SOCKET HELLO");
        });

        socket.on("disconnect", () => {
            console.log("disconnected");
        });
    });
};

export default socket;

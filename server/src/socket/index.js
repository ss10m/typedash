const socket = (io) => {
    io.on("connection", (socket) => {
        console.log("new connection");
        socket.emit("hello");

        socket.on("hello", () => {
            console.log("SOCKET HELLO");
        });

        socket.on("SendMessage", (data, cb) => {
            console.log("SendMessage", data);

            cb({ ok: "Sent from server" });
        });

        socket.on("disconnect", () => {
            console.log("disconnected");
        });
    });
};

export default socket;

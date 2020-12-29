import express from "express";
import http from "http";
import path from "path";
import ioClient from "socket.io";

import routes from "./routes.js";
import authenticated from "./middlewares/index.js";

const app = express();
const server = new http.Server(app);
const ioConnection = ioClient(server);

const PORT = 8080;
const HOST = "0.0.0.0";

const CLIENT_BUILD_PATH = path.join(path.resolve(), "../client/build");
app.use(express.static(CLIENT_BUILD_PATH));
app.use("/api/v2", authenticated);

routes(app);

app.get("*", (request, response) => {
    response.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
});

ioConnection.on("connection", (socket) => {
    console.log("new connection");
    socket.emit("hello");

    socket.on("hello", () => {
        console.log("SOCKET HELLO");
    });

    socket.on("disconnect", () => {
        console.log("disconnected");
    });
});

server.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));

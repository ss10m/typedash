import express from "express";
import session from "express-session";
import sharedsession from "express-socket.io-session";
import ioClient from "socket.io";
import http from "http";

import { sessionDetails } from "./config/session.js";
import routes from "./routes/index.js";
import socket from "./socket/index.js";

const PORT = 8080;
const HOST = "0.0.0.0";

const app = express(sessionDetails);
const server = new http.Server(app);
const io = ioClient(server);

const expressSession = session(sessionDetails);
app.use(expressSession);
app.use(express.json());
io.use(sharedsession(expressSession));

routes(app);
socket(io);

server.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));

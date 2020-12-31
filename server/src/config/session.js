import pgSimpleSession from "connect-pg-simple";
import session from "express-session";
import { pgPool } from "./db.js";

const SESS_NAME = "sid";
const SESS_SECRET = "secret!session";
const SESS_LIFETIME = 1000 * 60 * 60 * 24 * 60; // 60 days
const pgSession = new pgSimpleSession(session);

const sessionDetails = {
    name: SESS_NAME,
    secret: SESS_SECRET,
    saveUninitialized: false,
    resave: false,
    store: new pgSession({
        pool: pgPool,
        tableName: "session",
    }),
    cookie: {
        maxAge: parseInt(SESS_LIFETIME),
    },
};

export { sessionDetails, SESS_NAME };

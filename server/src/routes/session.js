import express from "express";
import db from ".././config/db.js";
import { SESS_NAME } from "../config/session.js";

import { parseError } from "../util/helper.js";

const router = express.Router();

// GET SESSION
router.get("", async ({ session: { user } }, res) => {
    try {
        res.send({
            meta: { ok: true, message: "" },
            data: { user },
        });
    } catch (err) {
        res.send({ meta: { ok: false, message: parseError(err) }, data: {} });
    }
});

// LOGIN
router.post("", async (req, res) => {
    console.log("LOGIN");
    const sessionizeUser = (user) => {
        return { id: user.id, username: user.username, last_login: new Date() };
    };
    const query = "SELECT * FROM users WHERE username = $1";
    const values = ["tom"];
    const result = await db.query(query, values);

    const sessionUser = sessionizeUser(result.rows[0]);
    console.log(sessionUser);
    req.session.user = sessionUser;

    res.send({ data: { user: sessionUser } });
});

// LOGIN AS GUEST
router.post("/guest", async (req, res) => {});

// REGISTER
router.post("/register", async (req, res) => {});

// LOGOUT
router.delete("", async ({ session, body }, res) => {
    console.log("LOG OUT");

    session.destroy((err) => {
        if (err) console.log("ERR");
        res.clearCookie(SESS_NAME);
        res.send({ msg: "LOGGED OUT" });
    });
});

export default router;

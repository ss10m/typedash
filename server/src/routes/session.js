import express from "express";
import Joi from "joi";

import db from ".././config/db.js";
import { SESS_NAME } from "../config/session.js";

import { signIn, signUp } from "../validations/user.js";

import {
    parseError,
    sessionizeUser,
    encryptPassword,
    verifyPassword,
} from "../util/helper.js";

const router = express.Router();

// GET SESSION
router.get("", async ({ session: { user } }, res) => {
    res.send({
        meta: { ok: true, message: "" },
        data: { user },
    });
});

// LOGIN
router.post("", async (req, res) => {
    try {
        const { username, password } = req.body;
        await Joi.validate({ username, password }, signIn);
        const query = "SELECT * FROM users WHERE username = $1";
        const values = [username];
        const result = await db.query(query, values);
        if (!result.rows.length) {
            res.send({
                meta: {
                    ok: false,
                    message: "Account does not exist!",
                    action: "LOGIN_ERROR",
                },
                data: {},
            });
            return;
        }

        const user = result.rows[0];
        if (user && verifyPassword(user, password)) {
            const sessionUser = sessionizeUser(user);
            req.session.user = sessionUser;

            res.send({
                meta: {
                    ok: true,
                    message: "",
                },
                data: { user: sessionUser },
            });
        } else {
            res.send({
                meta: {
                    ok: false,
                    message: "Invalid login credentials",
                    action: "LOGIN_ERROR",
                },
                data: {},
            });
        }
    } catch (err) {
        let meta = { ok: false, message: parseError(err) };
        if (err.isJoi) meta.action = "LOGIN_ERROR";
        res.send({ meta, data: {} });
    }
});

// LOGIN AS GUEST
router.post("/guest", async (req, res) => {
    try {
        const query =
            "SELECT * FROM users WHERE username LIKE 'Guest#%' ORDER BY created_at DESC LIMIT 1";
        const result = await db.query(query);

        let lastId;
        if (result.rows.length) {
            let username = result.rows[0].username;
            lastId = parseInt(username.split("#")[1]) + 1;
        } else {
            lastId = 2551;
        }

        const queryInsert =
            "INSERT INTO users(username, email, salt, hash) VALUES($1, $2, $3, $4) RETURNING *";
        const valuesInsert = [`Guest#${lastId}`, "", "", ""];
        const user = await db.query(queryInsert, valuesInsert);

        const sessionUser = sessionizeUser(user.rows[0]);
        req.session.user = sessionUser;
        res.send({
            meta: {
                ok: true,
                message: "",
            },
            data: { user: sessionUser },
        });
    } catch (err) {
        let meta = { ok: false, message: parseError(err) };
        res.send({ meta, data: {} });
    }
});

// CLAIM GUEST ACCOUNT
router.post("/claim", async (req, res) => {});

// REGISTER
router.post("/register", async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body;
        await Joi.validate({ username, email, password, confirmPassword }, signUp);

        const query = "SELECT * FROM users WHERE username = $1";
        const values = [username];
        const result = await db.query(query, values);
        if (result.rows.length) {
            res.send({
                meta: {
                    ok: false,
                    message: "Username already exists",
                    action: "REG_ERROR",
                },
                data: {},
            });
            return;
        }

        const { salt, hash } = encryptPassword(password);
        const queryInsert =
            "INSERT INTO users(username, display_name, email, salt, hash) VALUES($1, $2, $3, $4, $5) RETURNING *";
        const valuesInsert = [username.toLowerCase(), username, email, salt, hash];
        const user = await db.query(queryInsert, valuesInsert);

        const sessionUser = sessionizeUser(user.rows[0]);
        req.session.user = sessionUser;
        res.send({
            meta: {
                ok: true,
                message: "",
            },
            data: { user: sessionUser },
        });
    } catch (err) {
        console.log(err);
        let meta = { ok: false, message: parseError(err) };
        if (err.isJoi) meta.action = "REG_ERROR";
        res.send({ meta, data: {} });
    }
});

// LOGOUT
router.delete("", async ({ session, body }, res) => {
    try {
        session.destroy((err) => {
            if (err) throw err;
            res.clearCookie(SESS_NAME);
            res.send({ meta: { ok: true, message: "" }, data: {} });
        });
    } catch (err) {
        res.send({ meta: { ok: false, message: parseError(err) }, data: {} });
    }
});

export default router;

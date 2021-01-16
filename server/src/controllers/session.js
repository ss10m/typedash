import Joi from "joi";

import db from ".././config/db.js";
import { SESS_NAME } from "../config/session.js";

import { signUp, usernameCheck } from "../validations/user.js";

import {
    parseError,
    sessionizeUser,
    encryptPassword,
    verifyPassword,
} from "../util/helper.js";

const getSession = (session, cb) => {
    cb({
        meta: { ok: true, message: "" },
        data: { user: session.user },
    });
};

const login = async (session, body, cb) => {
    try {
        const { username, password } = body;
        const query = "SELECT * FROM users WHERE username = $1";
        const values = [username.toLowerCase()];
        const result = await db.query(query, values);
        if (!result.rows.length) {
            cb({
                meta: {
                    ok: false,
                    message: "Account does not exist!",
                },
                data: {},
            });
            return;
        }

        const user = result.rows[0];
        if (user && verifyPassword(user, password)) {
            const sessionUser = sessionizeUser(user);
            session.user = sessionUser;

            cb({
                meta: {
                    ok: true,
                    message: "",
                },
                data: { user: sessionUser },
            });
        } else {
            cb({
                meta: {
                    ok: false,
                    message: "Invalid password",
                },
                data: {},
            });
        }
    } catch (err) {
        let meta = { ok: false, message: parseError(err) };
        cb({ meta, data: {} });
    }
};

const loginAsGuest = async (session, body, cb) => {
    try {
        const { username } = body;
        await Joi.validate({ username }, usernameCheck);

        const query = "SELECT * FROM users WHERE username = $1";
        const values = [username.toLowerCase()];
        const result = await db.query(query, values);
        if (result.rows.length) {
            cb({
                meta: {
                    ok: false,
                    message: "Username already exists",
                },
                data: {},
            });
            return;
        }

        const queryInsert = `INSERT INTO users(account_type, username, display_name, email, salt, hash) 
                    VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
        const valuesInsert = [3, username.toLowerCase(), username, "", "", ""];
        const user = await db.query(queryInsert, valuesInsert);

        const sessionUser = sessionizeUser(user.rows[0]);
        session.user = sessionUser;
        cb({
            meta: {
                ok: true,
                message: "",
            },
            data: { user: sessionUser },
        });
    } catch (err) {
        let meta = { ok: false, message: parseError(err) };
        cb({ meta, data: {} });
    }
};

const claimAccount = async (session, body, cb) => {};

const register = async (session, body, cb) => {
    try {
        const { username, email, password, confirmPassword } = body;
        await Joi.validate({ username, email, password, confirmPassword }, signUp);

        const query = "SELECT * FROM users WHERE username = $1";
        const values = [username.toLowerCase()];
        const result = await db.query(query, values);
        if (result.rows.length) {
            cb({
                meta: {
                    ok: false,
                    message: "Username already exists",
                },
                data: {},
            });
            return;
        }

        const { salt, hash } = encryptPassword(password);
        const queryInsert = `INSERT INTO users(account_type, username, display_name, email, salt, hash) 
                    VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
        const valuesInsert = [2, username.toLowerCase(), username, email, salt, hash];
        const user = await db.query(queryInsert, valuesInsert);

        const sessionUser = sessionizeUser(user.rows[0]);
        session.user = sessionUser;
        cb({
            meta: {
                ok: true,
                message: "",
            },
            data: { user: sessionUser },
        });
    } catch (err) {
        let meta = { ok: false, message: parseError(err) };
        cb({ meta, data: {} });
    }
};

const logout = (session, res) => {
    try {
        session.destroy((err) => {
            if (err) throw err;
            res.clearCookie(SESS_NAME);
            res.send({ meta: { ok: true, message: "" }, data: {} });
        });
    } catch (err) {
        res.send({ meta: { ok: false, message: parseError(err) }, data: {} });
    }
};

export { getSession, login, loginAsGuest, claimAccount, register, logout };
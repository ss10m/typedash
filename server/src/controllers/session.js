import Joi from "joi";

import db from ".././config/db.js";
import { SESS_NAME } from "../config/session.js";

import { signUp, usernameCheck, emailCheck, passwordCheck } from "../validations/user.js";

import { Connection, Room } from "../core/index.js";

import {
    parseError,
    sessionizeUser,
    encryptPassword,
    confirmPassword,
} from "../util/helper.js";

import { ACCOUNT_TYPE } from "../util/constants.js";

const getSession = async (session, cb) => {
    let userSession = null;
    if (session.user) {
        const user = await getUserById(session.user.id);
        userSession = sessionizeUser(user);
    }

    cb({
        meta: { ok: true, message: "" },
        data: { user: userSession },
    });
};

const login = async (session, body, cb) => {
    try {
        const { username, password } = body;

        const user = await getUserByUsername(username);
        if (!user) {
            return cb({
                meta: {
                    ok: false,
                    message: "Account does not exist",
                },
                data: {},
            });
        }

        if (confirmPassword(user, password)) {
            const userSession = sessionizeUser(user);
            session.user = { id: user.id };
            cb({
                meta: {
                    ok: true,
                    message: "",
                },
                data: { user: userSession },
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
        const meta = { ok: false, message: parseError(err) };
        cb({ meta, data: {} });
    }
};

const loginAsGuest = async (session, body, cb) => {
    try {
        const { username } = body;

        await Joi.validate({ username }, usernameCheck);

        if (await getUserByUsername(username)) {
            return cb({
                meta: {
                    ok: false,
                    message: "Username already exists",
                },
                data: {},
            });
        }

        const query = `INSERT INTO users(account_type, username, display_name, email, salt, hash)
                       VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
        const values = [ACCOUNT_TYPE.GUEST, username.toLowerCase(), username, "", "", ""];
        const results = await db.query(query, values);

        const user = results.rows[0];
        const userSession = sessionizeUser(user);
        session.user = { id: user.id };

        cb({
            meta: {
                ok: true,
                message: "",
            },
            data: { user: userSession },
        });
    } catch (err) {
        const meta = { ok: false, message: parseError(err) };
        cb({ meta, data: {} });
    }
};

const claimAccount = async (session, body, cb) => {
    try {
        const { username, email, password, confirmPassword } = body;

        await Joi.validate({ username, email, password, confirmPassword }, signUp);

        const user = await getUserById(session.user.id);
        if (user.account_type !== ACCOUNT_TYPE.GUEST) {
            return cb({
                meta: {
                    ok: false,
                    message: "Invalid accouny type",
                },
                data: {},
            });
        }

        const existingUser = await getUserByUsername(username);
        if (existingUser && existingUser.id !== session.user.id) {
            return cb({
                meta: {
                    ok: false,
                    message: "Username already exists",
                },
                data: {},
            });
        }

        const { salt, hash } = encryptPassword(password);
        const query = `UPDATE users
                       SET account_type = $1,
                           username = $2,
                           display_name = $3,
                           email = $4,
                           salt = $5,
                           hash = $6
                       WHERE id = $7
                       RETURNING *`;
        const values = [
            ACCOUNT_TYPE.NORMAL,
            username.toLowerCase(),
            username,
            email,
            salt,
            hash,
            user.id,
        ];
        const results = await db.query(query, values);

        const updatedUser = results.rows[0];
        const userSession = sessionizeUser(updatedUser);
        session.user = { id: updatedUser.id };

        cb({
            meta: {
                ok: true,
                message: "",
            },
            data: { user: userSession },
        });
    } catch (err) {
        const meta = { ok: false, message: parseError(err) };
        cb({ meta, data: {} });
    }
};

const changeUsername = async (session, body, cb) => {
    try {
        const { username, socketId } = body;

        await Joi.validate({ username }, usernameCheck);

        if (await getUserByUsername(username)) {
            return cb({
                meta: {
                    ok: false,
                    message: "Username already exists",
                },
                data: {},
            });
        }

        const query = `UPDATE users
                       SET username = $1,
                           display_name = $2
                       WHERE id = $3
                       RETURNING *`;
        const values = [username.toLowerCase(), username, session.user.id];
        const results = await db.query(query, values);

        const user = results.rows[0];
        const userSession = sessionizeUser(user);
        session.user = { id: user.id };

        const room = Room.getRoomBySocketId(socketId);
        if (room) room.changeUsername(session.user.id, username);

        cb({
            meta: {
                ok: true,
                message: "",
            },
            data: { user: userSession },
        });
    } catch (err) {
        const meta = { ok: false, message: parseError(err) };
        cb({ meta, data: {} });
    }
};

const changeEmail = async (session, body, cb) => {
    try {
        const { email } = body;

        await Joi.validate({ email }, emailCheck);

        const query = "SELECT * FROM users WHERE id = $1";
        const values = [session.user.id];
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

        const queryUpdate = `UPDATE users
                             SET email = $1
                             WHERE id = $2 RETURNING *`;
        const valuesUpdate = [email, session.user.id];
        await db.query(queryUpdate, valuesUpdate);

        cb({
            meta: {
                ok: true,
                message: "",
            },
            data: {},
        });
    } catch (err) {
        const meta = { ok: false, message: parseError(err) };
        cb({ meta, data: {} });
    }
};

const verifyPassword = async (session, body, cb) => {
    try {
        const { password } = body;

        const query = "SELECT * FROM users WHERE id = $1";
        const values = [session.user.id];
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
        if (user && confirmPassword(user, password)) {
            cb({
                meta: {
                    ok: true,
                    message: "",
                },
                data: {},
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
        const meta = { ok: false, message: parseError(err) };
        cb({ meta, data: {} });
    }
};

const changePassword = async (session, body, cb) => {
    try {
        const { password, newPassword } = body;

        await Joi.validate({ password: newPassword }, passwordCheck);

        const query = "SELECT * FROM users WHERE id = $1";
        const values = [session.user.id];
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
        if (!confirmPassword(user, password)) {
            return cb({
                meta: {
                    ok: false,
                    message: "Incorrect password",
                },
                data: {},
            });
        }

        const { salt, hash } = encryptPassword(newPassword);
        const queryUpdate = `UPDATE users
                             SET salt = $1,
                                 hash = $2
                             WHERE id = $3`;
        const valuesUpdate = [salt, hash, session.user.id];
        await db.query(queryUpdate, valuesUpdate);

        cb({
            meta: {
                ok: true,
                message: "",
            },
            data: {},
        });
    } catch (err) {
        const meta = { ok: false, message: parseError(err) };
        cb({ meta, data: {} });
    }
};

const register = async (session, body, cb) => {
    try {
        const { username, email, password, confirmPassword } = body;

        await Joi.validate({ username, email, password, confirmPassword }, signUp);

        if (await getUserByUsername(username)) {
            return cb({
                meta: {
                    ok: false,
                    message: "Username already exists",
                },
                data: {},
            });
        }

        const { salt, hash } = encryptPassword(password);
        const query = `INSERT INTO users(account_type, username, display_name, email, salt, hash) 
                             VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
        const values = [
            ACCOUNT_TYPE.NORMAL,
            username.toLowerCase(),
            username,
            email,
            salt,
            hash,
        ];
        const results = await db.query(query, values);

        const user = results.rows[0];
        const userSession = sessionizeUser(user);
        session.user = { id: user.id };

        cb({
            meta: {
                ok: true,
                message: "",
            },
            data: { user: userSession },
        });
    } catch (err) {
        const meta = { ok: false, message: parseError(err) };
        cb({ meta, data: {} });
    }
};

const logout = (session, body, res) => {
    Connection.logoutClients(body.id);
    session.destroy((err) => {
        if (err) {
            res.send({ meta: { ok: false, message: parseError(err) }, data: {} });
            return;
        }
        res.clearCookie(SESS_NAME);
        res.send({ meta: { ok: true, message: "" }, data: {} });
    });
};

const getUserById = async (userId) => {
    const query = "SELECT * FROM users WHERE id = $1";
    const values = [userId];
    const results = await db.query(query, values);
    return results.rows.length ? results.rows[0] : null;
};

const getUserByUsername = async (username) => {
    const query = "SELECT * FROM users WHERE username = $1";
    const values = [username.toLowerCase()];
    const results = await db.query(query, values);
    return results.rows.length ? results.rows[0] : null;
};

export {
    getSession,
    login,
    loginAsGuest,
    claimAccount,
    changeUsername,
    changeEmail,
    changePassword,
    verifyPassword,
    register,
    logout,
};

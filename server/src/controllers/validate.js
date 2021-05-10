import Joi from "joi";
import db from ".././config/db.js";

import { TEST_TYPE, FIELD_TYPE } from "../util/constants.js";

import { usernameCheck, emailCheck, passwordCheck } from "../validations/user.js";

const validate = (body, session, cb) => {
    const { type, test, value } = body;

    switch (test) {
        case TEST_TYPE.VALID:
            return validInput(type, value, cb);
        case TEST_TYPE.AVAILABLE:
            return usernameAvailable(value, false, session, cb);
        case TEST_TYPE.AVAILABLE_OR_CURRENT:
            return usernameAvailable(value, true, session, cb);
        case TEST_TYPE.EXISTS:
            return usernameExists(value, cb);
        default:
            return;
    }
};

const validInput = async (type, value, cb) => {
    try {
        switch (type) {
            case FIELD_TYPE.EMAIL:
                await Joi.validate({ email: value }, emailCheck);
                break;
            case FIELD_TYPE.PASSWORD:
                await Joi.validate({ password: value }, passwordCheck);
                break;
            default:
                throw new Error();
        }

        cb({
            meta: {
                ok: true,
                message: "",
            },
            data: { value },
        });
    } catch (err) {
        const meta = { ok: false, message: "Invalid Value" };
        cb({ meta, data: {} });
    }
};

const usernameAvailable = async (username, checkCurrent, session, cb) => {
    try {
        await Joi.validate({ username }, usernameCheck);

        const user = await getUserByUsername(username);

        if (!user || (checkCurrent && user.id === session.user.id)) {
            return cb({
                meta: {
                    ok: true,
                    message: "",
                },
                data: { value: username },
            });
        }

        cb({
            meta: {
                ok: false,
                message: "Username already exists",
            },
            data: {},
        });
    } catch (err) {
        const meta = { ok: false, message: "Invalid Value" };
        cb({ meta, data: {} });
    }
};

const usernameExists = async (username, cb) => {
    try {
        await Joi.validate({ username }, usernameCheck);

        const user = await getUserByUsername(username);

        if (!user) {
            return cb({
                meta: {
                    ok: false,
                    message: "Username does not exist",
                },
                data: {},
            });
        }

        cb({
            meta: {
                ok: true,
                message: "",
            },
            data: { value: username },
        });
    } catch (err) {
        const meta = { ok: false, message: "Invalid Value" };
        cb({ meta, data: {} });
    }
};

const getUserByUsername = async (username) => {
    const query = "SELECT * FROM users WHERE username = $1";
    const values = [username.toLowerCase()];
    const results = await db.query(query, values);
    return results.rows.length ? results.rows[0] : null;
};

export default validate;

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
        let meta = { ok: false, message: "Invalid Value" };
        cb({ meta, data: {} });
    }
};

const usernameAvailable = async (value, checkCurrent, session, cb) => {
    try {
        const { user } = session;
        const username = value.toLowerCase();

        await Joi.validate({ username: value }, usernameCheck);

        if (checkCurrent && user && user.username === username) {
            cb({
                meta: {
                    ok: true,
                    message: "",
                },
                data: { value },
            });
            return;
        }

        const query = "SELECT * FROM users WHERE username = $1";
        const values = [username];
        const result = await db.query(query, values);
        if (result.rows.length) {
            cb({
                meta: {
                    ok: false,
                    message: "Username already exists",
                },
                data: {},
            });
        } else {
            cb({
                meta: {
                    ok: true,
                    message: "",
                },
                data: { value },
            });
        }
    } catch (err) {
        let meta = { ok: false, message: "Invalid Value" };
        cb({ meta, data: {} });
    }
};

const usernameExists = async (username, cb) => {
    try {
        await Joi.validate({ username }, usernameCheck);

        const query = "SELECT * FROM users WHERE username = $1";
        const values = [username.toLowerCase()];
        const result = await db.query(query, values);
        if (result.rows.length) {
            cb({
                meta: {
                    ok: true,
                    message: "",
                },
                data: { value: username },
            });
        } else {
            cb({
                meta: {
                    ok: false,
                    message: "Username does not exist",
                },
                data: {},
            });
        }
    } catch (err) {
        let meta = { ok: false, message: "Invalid Value" };
        cb({ meta, data: {} });
    }
};

export default validate;

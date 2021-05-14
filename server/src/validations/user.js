import Joi from "joi";

const email = Joi.string()
    .email()
    .required()
    .max(50)
    .error(() => {
        return {
            message: "Email address is not valid",
        };
    });

const username = Joi.string()
    .alphanum()
    .min(4)
    .max(12)
    .required()
    .error(() => {
        return {
            message: "Username must be between 4 to 12 characters long",
        };
    });

const password = Joi.string()
    .regex(/^[^\s\\]{8,30}$/)
    .required()
    .error(() => {
        return {
            message: "Password must be between 8 to 30 characters long",
        };
    });

const confirmPassword = Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .error(() => {
        return {
            message: "Passwords do not match",
        };
    });

export const signUp = Joi.object().keys({
    username,
    email,
    password,
    confirmPassword,
});

export const signIn = Joi.object().keys({
    username,
    password,
});

export const usernameCheck = Joi.object().keys({
    username,
});

export const emailCheck = Joi.object().keys({
    email,
});

export const passwordCheck = Joi.object().keys({
    password,
});

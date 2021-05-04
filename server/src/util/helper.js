import crypto from "crypto";

export const parseError = (err) => {
    let message = "";
    if (err && err.isJoi) {
        message = err.details[0].message;
    } else {
        message = "Internal Server Error";
    }
    return message;
};

export const sessionizeUser = (user) => {
    return {
        id: user.id,
        username: user.username,
        displayName: user.display_name,
        accountType: user.account_type,
        createdAt: user.created_at,
    };
};

export const encryptPassword = (password) => {
    let salt = crypto.randomBytes(16).toString("hex");
    let hash = crypto.pbkdf2Sync(password, salt, 10000, 512, "sha512").toString("hex");
    return { salt, hash };
};

export const confirmPassword = (user, password) => {
    const hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, "sha512").toString("hex");
    return user.hash === hash;
};

export const parseError = (err) => {
    let message = "";
    if (err.isJoi) {
        message = err.details[0].message;
    } else {
        message = "Internal Server Error";
    }
    return message;
};

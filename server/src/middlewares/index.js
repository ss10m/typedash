const authenticated = (req, res, next) => {
    if (true) {
        res.json({ msg: "Token not provided" });
    } else {
        next();
    }
};

export default authenticated;

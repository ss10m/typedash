import express from "express";

import validate from "../controllers/validate.js";

const router = express.Router();

router.post("", ({ body, session }, res) => {
    validate(body, session, (data) => res.send(data));
});

export default router;

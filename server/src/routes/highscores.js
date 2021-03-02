import express from "express";

import getHighscores from "../controllers/highscores.js";

const router = express.Router();

router.post("", async (req, res) => {
    getHighscores(req.body.page, (data) => res.send(data));
});

export default router;

import express from "express";

import getHighscores from "../controllers/highscores.js";

const router = express.Router();

router.post("", async (req, res) => {
    const { page, rowCount } = req.body;
    getHighscores(page, rowCount, (data) => res.send(data));
});

export default router;

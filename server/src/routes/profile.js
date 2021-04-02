import express from "express";

import getProfile from "../controllers/profile.js";

const router = express.Router();

router.post("", async (req, res) => {
    const { username } = req.body;
    getProfile(username, (data) => res.send(data));
});

export default router;

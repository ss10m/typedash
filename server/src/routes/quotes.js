import express from "express";
import getQuotes from "../controllers/quotes.js";

const router = express.Router();

router.get("", async (req, res) => {
    getQuotes((data) => res.send(data));
});

export default router;

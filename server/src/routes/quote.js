import express from "express";
import { getQuotes, getQuote } from "../controllers/quote.js";

const router = express.Router();

router.get("", async (req, res) => {
    getQuotes((data) => res.send(data));
});

router.get("/:id", async (req, res) => {
    getQuote(req.params.id, (data) => res.send(data));
});

export default router;

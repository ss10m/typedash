import express from "express";
import { getQuotes, getQuote, getResults } from "../controllers/quote.js";

const router = express.Router();

router.get("", async (req, res) => {
    getQuotes((data) => res.send(data));
});

router.get("/:id", async (req, res) => {
    getQuote(req.params.id, (data) => res.send(data));
});

router.get("/:id/results", async (req, res) => {
    getResults(req.params.id, (data) => res.send(data));
});

export default router;

import express from "express";

import * as Session from "../controllers/session.js";

const router = express.Router();

// GET SESSION
router.get("", async ({ session }, res) => {
    Session.getSession(session, (data) => res.send(data));
});

// LOGIN
router.post("", async ({ session, body }, res) => {
    Session.login(session, body, (data) => res.send(data));
});

// LOGIN AS GUEST
router.post("/guest", async ({ session, body }, res) => {
    Session.loginAsGuest(session, body, (data) => res.send(data));
});

// CLAIM GUEST ACCOUNT
router.post("/claim", async ({ session, body }, res) => {
    Session.claimAccount(session, body, (data) => res.send(data));
});

// CHANGE USERNAME
router.post("/username", async ({ session, body }, res) => {
    Session.changeUsername(session, body, (data) => res.send(data));
});

// REGISTER
router.post("/register", async ({ session, body }, res) => {
    Session.register(session, body, (data) => res.send(data));
});

// LOGOUT
router.delete("", async ({ session, body }, res) => {
    Session.logout(session, body, res);
});

export default router;

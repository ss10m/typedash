import express from "express";
import path from "path";
import sessionRoutes from "./session.js";

const clientBuildPath = path.join(path.resolve(), "../client/build");

const routes = (app) => {
    app.use(express.static(clientBuildPath));

    const apiRouter = express.Router();
    app.use("/api", apiRouter);
    apiRouter.use("/session", sessionRoutes);

    app.get("*", (_, response) => {
        response.sendFile(path.join(clientBuildPath, "index.html"));
    });
};

export default routes;

const routes = (route) => {
    route.get("/api", (req, res) => {
        res.send({ msg: new Date() });
    });
};

export default routes;

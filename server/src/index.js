var express = require("express");
var app = express();

const PORT = 8080;
const HOST = "0.0.0.0";

app.get("/api", (req, res) => {
    console.log("req");
    res.send({ msg: new Date() });
});

app.listen(PORT, HOST, () => console.log(`Running on http://${HOST}:${PORT}`));

const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true })); // body-parser
app.use(express.json()); // for JSON payloads

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

app.get("/", (req, res) => {
    console.log("sup you");
    res.send("sup yall");
})
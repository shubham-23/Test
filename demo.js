const express = require("express");
const app = express();

// Production error handling middleware
app.use(function (err, req, res, next) {
    console.error(err);
    res.status(500).send("Internal Server Error");
});

// Route handlers
app.get("/", function (req, res) {
    res.send("Hello World!");
});
app.get("/error", function (req, res) {
    throw new Error("Something went wrong!");
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log(`Server listening on port ${port}`);
});
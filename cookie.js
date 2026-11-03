// app.js
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());

app.get("/setCookie", (req, res) => {
    res.cookie("username", "Alphabit", { maxAge: 100000, httpOnly: true });
    res.send("Cookie set successfully!");
});

app.get("/getCookie", (req, res) => {
    const username = req.cookies.username;
    res.send(username ? `Username: ${username}` : "No cookie found");
});

app.get("/clearCookie", (req, res) => {
    res.clearCookie("username");
    res.send("Cookie deleted successfully!");
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
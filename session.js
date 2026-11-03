// // app.js
// const express = require('express');
// const session = require('express-session');
// const app = express();

// app.use(session({
//     secret: 'secret_key', 
//     resave: false,
//     saveUninitialized: true,
// }));

// app.get('/setSession', (req, res) => {
//     req.session.username = 'Alphabit';
//     res.send('Session set successfully!');
// });

// app.get('/getSession', (req, res) => {
//     const username = req.session.username;
//     if (username) {
//         res.send(`Username from session: ${username}`);
//     } else {
//         res.send('No active session found');
//     }
// });

// app.get('/destroySession', (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send('Error destroying session');
//         } else {
//             res.send('Session destroyed successfully!');
//         }
//     });
// });

// app.listen(3000, () => {
//     console.log('Server is running on http://localhost:3000');
// });




const express = require("express");
const session = require("express-session");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: "student-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        maxAge: 10 * 60 * 1000
    }
}));

// Login: create session
app.post("/login", (req, res) => {
    req.session.student = "Alphabit";

    res.json({
        message: "Login successful!"
    });
});

// Read session
app.get("/profile", (req, res) => {
    if (!req.session.student) {
        return res.status(401).json({
            message: "Please login first"
        });
    }

    res.json({
        name: req.session.student
    });
});

// Logout: destroy session
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                message: "Logout failed"
            });
        }

        res.clearCookie("connect.sid");
        res.json({
            message: "Logout successful!"
        });
    });
});

app.listen(3000, () => {
    console.log("Backend running at http://localhost:3000");
});

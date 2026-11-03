const express = require("express");
const app = express();

app.use(express.json());

// Demo users
const users = [
    { username: "admin", password: "123", role: "admin" },
    { username: "seller", password: "123", role: "seller" },
    { username: "customer", password: "123", role: "customer" }
];

// Login API
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        (u) => u.username === username &&
               u.password === password
    );

    if (!user) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    // Display data according to role
    if (user.role === "admin") {
        return res.json({
            role: "admin",
            message: "Welcome Admin",
            data: ["Manage Users", "Manage Sellers", "View All Orders"]
        });
    }

    if (user.role === "seller") {
        return res.json({
            role: "seller",
            message: "Welcome Seller",
            data: ["Add Products", "Manage My Products", "View My Orders"]
        });
    }

    if (user.role === "customer") {
        return res.json({
            role: "customer",
            message: "Welcome Customer",
            data: ["View Products", "Add to Cart", "My Orders"]
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
const express = require("express");

const router = express.Router();

const {
    register,
    verifyEmail,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");

// Registration
router.post("/register", register);

// Email verification
router.get("/verify-email/:token", verifyEmail);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password/:token", resetPassword);

module.exports = router;
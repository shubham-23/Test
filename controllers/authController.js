const User = require("../model/user");

const transporter = require("../config/mail");

const bcrypt = require("bcryptjs");

const crypto = require("crypto");


// REGISTER USER
exports.register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "Email already registered"
            });

        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const token = crypto.randomBytes(32).toString("hex");

        // Save user
        const user = new User({

            name,
            email,

            password: hashedPassword,

            verificationToken: token,

            verificationExpiry: new Date(Date.now() + 15 * 60 * 1000)

        });

        await user.save();

        // Create verification link
        const verificationLink =
    `${process.env.FRONTEND_URL}/verify-email/${token}`;

        // Send verification email
        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: email,

            subject: "Verify Your Email",

            html: `
                <h2>Hello ${name}</h2>

                <p>Please verify your email address.</p>

                <a href="${verificationLink}">
                    Verify Email
                </a>

                <p>This link expires in 15 minutes.</p>
            `

        });

        res.status(201).json({

            success: true,

            message: "Registration successful. Check your email to verify your account."

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Registration failed"
        });

    }

};



// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {

    try {

        const { token } = req.params;

        // Find user using token
        const user = await User.findOne({

            verificationToken: token,

            verificationExpiry: { $gt: new Date() }

        });

        if (!user) {

            return res.status(400).json({
                message: "Invalid or expired verification link"
            });

        }

        // Update verification status
        user.isVerified = true;

        user.verificationToken = null;

        user.verificationExpiry = null;

        await user.save();

        res.status(200).json({

            success: true,

            message: "Email verified successfully"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Email verification failed"
        });

    }

};


// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {

            return res.status(400).json({
                message: "Email is required"
            });

        }

        const user = await User.findOne({ email });

        if (!user || !user.isVerified) {

            return res.status(200).json({
                message: "If the account exists and is verified, a reset link will be sent."
            });

        }

        // Generate reset token
        const token = crypto.randomBytes(32).toString("hex");

        user.resetToken = token;

        user.resetExpiry = new Date(Date.now() + 15 * 60 * 1000);

        await user.save();

        // Reset link
        const resetLink =
    `${process.env.FRONTEND_URL}/reset-password/${token}`;
    
        // Send email
        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: email,

            subject: "Reset Your Password",

            html: `
                <h2>Password Reset Request</h2>

                <p>Click below to reset your password.</p>

                <a href="${resetLink}">
                    Reset Password
                </a>

                <p>This link expires in 15 minutes.</p>

                <p>If you did not request this, ignore this email.</p>
            `

        });

        res.status(200).json({

            success: true,

            message: "If the account exists and is verified, a reset link will be sent."

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Password reset request failed"
        });

    }

};


// RESET PASSWORD
exports.resetPassword = async (req, res) => {

    try {

        const { token } = req.params;

        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 8) {

            return res.status(400).json({
                message: "Password must contain at least 8 characters"
            });

        }

        // Find user with valid reset token
        const user = await User.findOne({

            resetToken: token,

            resetExpiry: { $gt: new Date() }

        });

        if (!user) {

            return res.status(400).json({
                message: "Invalid or expired reset link"
            });

        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password = hashedPassword;

        // Remove reset token
        user.resetToken = null;

        user.resetExpiry = null;

        await user.save();

        res.status(200).json({

            success: true,

            message: "Password reset successfully"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Password reset failed"
        });

    }

};
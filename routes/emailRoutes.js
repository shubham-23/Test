const express = require("express");
const router = express.Router();

const transporter = require("../config/mail");

router.post("/send-email", async (req, res) => {

    try {

        const { to, subject, message } = req.body;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: to,
            subject: subject,
            text: message
        };

        const info = await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "Email sent successfully!",
            messageId: info.messageId
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Email sending failed",
            error: error.message
        });

    }

});

module.exports = router;
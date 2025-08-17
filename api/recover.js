import bcrypt from "bcrypt";
import pkg from "pg";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
    // eslint-disable-next-line no-undef
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

// Email transporter configuration
const transporter = nodemailer.createTransport({
    // eslint-disable-next-line no-undef
    host: process.env.EMAIL_SERVICE || "smtp.gmail.com", // or your preferred email service
    port: 2525,
    auth: {
        // eslint-disable-next-line no-undef
        user: process.env.EMAIL_USER, // your email
        // eslint-disable-next-line no-undef
        pass: process.env.EMAIL_PASS, // your email password or app password
    },
});

export default async function handler(req, res) {
    if (req.method === "POST") {
        return await handleForgotPassword(req, res);
    } else if (req.method === "PUT") {
        return await handleResetPassword(req, res);
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

// Handle forgot password request
async function handleForgotPassword(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        // Check if user exists
        const result = await pool.query(
            `SELECT user_id, email, username, full_name FROM users WHERE LOWER(email) = LOWER($1) LIMIT 1`, [email]
        );

        // Always return success message for security (don't reveal if email exists)
        if (result.rows.length === 0) {
            return res.status(200).json({
                message: "If an account with that email exists, we've sent you a password reset link."
            });
        }

        const user = result.rows[0];

        // Generate reset token (valid for 1 hour)
        const resetToken = jwt.sign({ userId: user.user_id, email: user.email, type: "password-reset" },
            // eslint-disable-next-line no-undef
            process.env.JWT_SECRET, { expiresIn: "1h" }
        );

        // Store reset token in database (PostgreSQL interval syntax)
        await pool.query(
            `UPDATE users SET reset_token = $1, reset_token_expires = NOW() + INTERVAL '1 hour' WHERE user_id = $2`, [resetToken, user.user_id]
        );

        // Send reset email
        const resetUrl = `${process.env.VITE_API_URL || 'http://localhost:5000'}/recover?token=${resetToken}`;

        const mailOptions = {
            // eslint-disable-next-line no-undef
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "CampusFind - Password Reset Request",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #059669;">Password Reset Request</h2>
                    <p>Hello ${user.full_name},</p>
                    <p>You have requested to reset your password for your CampusFind account.</p>
                    <p>Click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="background-color: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p>Or copy and paste this link in your browser:</p>
                    <p style="word-break: break-all; color: #4B5563;">${resetUrl}</p>
                    <p><strong>This link will expire in 1 hour.</strong></p>
                    <p>If you didn't request this password reset, please ignore this email.</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
                    <p style="color: #6B7280; font-size: 14px;">
                        Best regards,<br>
                        The CampusFind Team
                    </p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: "If an account with that email exists, we've sent you a password reset link."
        });

    } catch (err) {
        console.error("Forgot password error:", err);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
}

// Handle password reset with token
async function handleResetPassword(req, res) {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ error: "Token and new password are required" });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    try {
        // Verify and decode the reset token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.type !== "password-reset") {
            return res.status(400).json({ error: "Invalid reset token" });
        }

        // Check if user exists and token is still valid in database
        const result = await pool.query(
            `SELECT user_id, email, reset_token, reset_token_expires FROM users 
             WHERE user_id = $1 AND reset_token = $2 AND reset_token_expires > NOW()`, [decoded.userId, token]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password and clear reset token
        await pool.query(
            `UPDATE users SET 
             password_hash = $1, 
             reset_token = NULL, 
             reset_token_expires = NULL 
             WHERE user_id = $2`, [hashedPassword, decoded.userId]
        );

        res.status(200).json({
            message: "Password has been reset successfully. You can now log in with your new password."
        });

    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            return res.status(400).json({ error: "Invalid reset token" });
        }
        if (err.name === "TokenExpiredError") {
            return res.status(400).json({ error: "Reset token has expired" });
        }

        console.error("Reset password error:", err);
        res.status(500).json({ error: "Server error. Please try again later." });
    }
}
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Tactical Transporter Setup - High Reliability Version
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL for Port 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Prevents local certificate block
    },
    debug: true, // Show handshake in console
    logger: true, // Log every step in terminal
  });

  const mailOptions = {
    from: `"Jacksteve Logistics" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EMAIL DISPATCHED]: ID ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("[SMTP ERROR]: Dispatch Failed", error);
    throw error;
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // IF FULLY VERIFIED -> BLOCK (Actual Duplicate)
      if (user.isVerified) {
        return res.status(400).json({
          message: "This Partner is already active in the Jacksteve Database.",
        });
      }

      // IF UNVERIFIED -> RE-SYNC (The "Cleanup" Logic)
      console.log(
        `[RE-SYNCING]: Refreshing terminal for unverified user: ${email}`,
      );
      user.name = name;
      user.password = password;
      user.role = role;
    } else {
      // IF NEW -> CREATE PROFILE
      user = new User({ name, email, password, role });
    }

    // 2. Generate/Refresh the OTP
    const otp = user.getVerificationOtp();
    await user.save();

    // 3. Dispatch Activation Email
    try {
      await sendEmail({
        email: user.email,
        subject: "JACKSTEVE | TERMINAL ACTIVATION CODE",
        html: `<div style="font-family:sans-serif; border-top:4px solid #FFCC00; padding:20px;">
                <h2 style="font-style:italic;">IDENTITY VERIFICATION</h2>
                <p>Your activation code is: <b style="font-size:24px; color:#1a1a1a;">${otp}</b></p>
                <p>Enter this code in the terminal to activate your partner profile.</p>
                <p style="font-size:10px; color:#888;">Note: This replaces any previous code sent.</p>
              </div>`,
      });

      return res.status(201).json({
        message: "Account details updated. New verification code dispatched.",
      });
    } catch (emailError) {
      console.error("EMAIL_DISPATCH_ERROR:", emailError);
      return res.status(201).json({
        message:
          "Profile updated, but email dispatch failed. Verify server credentials.",
      });
    }
  } catch (error) {
    console.error("SYSTEM_REGISTRATION_CRASH:", error);
    return res.status(500).json({
      message: error.message || "Internal Terminal Error during Registration",
    });
  }
};

// @desc    Verify OTP & Activate Partner Terminal
// @route   POST /api/auth/verify
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. Find the user with matching email, OTP, and check if OTP has not expired
    const user = await User.findOne({
      email,
      otpCode: otp,
      otpExpire: { $gt: Date.now() },
    });

    // 2. If no user found or code expired
    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or Expired Activation Code. Please request a new one.",
      });
    }

    // 3. Update User Status to Active
    user.isVerified = true;
    user.otpCode = undefined; // Clear the code so it can't be used again
    user.otpExpire = undefined; // Clear the expiry
    await user.save();

    // 4. Return Session Data (For Auto-Login)
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), // Direct access token
      message: "TERMINAL ACTIVATED: ACCESS GRANTED",
    });

    console.log(
      `[TERMINAL ACTIVATED]: ${user.name} (${user.role}) is now online.`,
    );
  } catch (error) {
    console.error("VERIFICATION_SYSTEM_ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal Terminal Error during Activation.",
    });
  }
};

// @desc    Authenticate Partner & Verify Role Integrity
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    // 1. Get the requested role from the frontend switcher (FARMER or MILLER)
    const { email, password, role } = req.body;

    // 2. Find User by Email
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // 3. Validate Credentials
    if (user && (await user.matchPassword(password))) {
      // 4. ROLE INTEGRITY CHECK: Prevents Farmer from entering Miller Portal
      // We check if the database role matches the role they selected on the login page
      if (role && user.role.toUpperCase() !== role.toUpperCase()) {
        return res.status(401).json({
          success: false,
          message: `ACCESS DENIED: This account is registered as a ${user.role}. Please switch your selection.`,
        });
      }

      // 5. SECURITY GATE: Block unverified accounts
      if (!user.isVerified) {
        return res.status(401).json({
          success: false,
          message:
            "TERMINAL INACTIVE: Please verify your email to unlock access.",
        });
      }

      // 6. Dispatch Access Token & Profile Data
      console.log(`[ACCESS GRANTED]: ${user.name} (${user.role}) online.`);

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "INVALID CREDENTIALS: System Access Denied.",
      });
    }
  } catch (error) {
    console.error("LOGIN_SYSTEM_CRASH:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Terminal Error during Authentication.",
    });
  }
};

// @desc Forgotten Password - Dispatch Reset Token
export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(404).json({ message: "Identity not found in database" });

  const resetToken = user.getResetPasswordToken();
  await user.save();

  // Create reset URL (Adjust frontend URL as needed)
  // authController.js
  const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
const resetUrl = `${frontendURL}/login?view=reset&token=${resetToken}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "JACKSTEVE | RESET PASSKEY",
      html: `
    <div style="font-family:sans-serif; border-left:8px solid #FFCC00; padding:20px;">
      <h2 style="font-style:italic;">ACCESS RESET</h2>
      <p>Click the button below to update your passkey:</p>
      <a href="${resetUrl}" style="background:#000; color:#fff; padding:12px 24px; text-decoration:none; display:inline-block; font-weight:bold;">
        RESET PASSKEY
      </a>
      <p style="margin-top:20px; font-size:10px; color:#888;">If the button fails, copy-paste this: ${resetUrl}</p>
    </div>`,
    });

    res.json({ message: "Reset instructions sent to email." });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    res.status(500).json({ message: "Email could not be sent" });
  }
};

// @desc Reset Password using Token
// @desc    Reset Passkey using Security Token
// @route   PUT /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
  try {
    // 1. Hash the incoming token from the URL to match the one in the DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // 2. Find the user with a valid, non-expired token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    // 3. Check if user exists
    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "SECURITY ALERT: Invalid or expired reset token. Please request a new dispatch.",
      });
    }

    // 4. Update the Passkey & Clear the Token fields
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    console.log(`[PASSKEY RESET]: Access restored for ${user.email}`);

    // 5. Final Success Response
    res.status(200).json({
      success: true,
      message:
        "PASSKEY UPDATED: Terminal access restored. Redirecting to Login...",
    });
  } catch (error) {
    console.error("RESET_PASSWORD_CRASH:", error);
    res.status(500).json({
      success: false,
      message: "Internal Terminal Error during Passkey Reset.",
    });
  }
};

// @desc Terminate Partner Session
// @route POST /api/auth/logout
export const logoutUser = async (req, res) => {
  try {
    // In a JWT setup, the client simply deletes the token.
    // We send a success response to confirm the 'System Exit'.
    res.status(200).json({
      success: true,
      message: "Session Terminated. Jacksteve Terminal Disconnected.",
    });
  } catch (error) {
    res.status(500).json({ message: "Logout Error" });
  }
};

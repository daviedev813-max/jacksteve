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

    // 1. Validation: Ensure all critical fields exist
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "TERMINAL ERROR: All fields (Name, Email, Password, Role) are required.",
      });
    }

    // 2. NORMALIZE: Ensure email is lowercase and trimmed
    const cleanEmail = email.toLowerCase().trim();
    const cleanRole = role.toUpperCase().trim(); // Matches your Schema Enum: "FARMER", "MILLER", "ADMIN"

    // 3. Check if user already exists
    let user = await User.findOne({ email: cleanEmail });

    if (user) {
      // IF FULLY VERIFIED -> BLOCK (Actual Duplicate)
      if (user.isVerified) {
        return res.status(400).json({
          message: "This Partner is already active in the Jacksteve Database.",
        });
      }

      // IF UNVERIFIED -> RE-SYNC (Update details and send new OTP)
      console.log(`[RE-SYNCING]: Refreshing terminal for: ${cleanEmail}`);
      user.name = name;
      user.password = password; // Middleware in User.js will re-hash this
      user.role = cleanRole;
    } else {
      // IF NEW -> CREATE PROFILE with cleaned data
      user = new User({ 
        name, 
        email: cleanEmail, 
        password, 
        role: cleanRole 
      });
    }

    // 4. Generate/Refresh the OTP (Using your User Model method)
    const otp = user.getVerificationOtp();
    await user.save();

    // 5. Dispatch Activation Email
    try {
      await sendEmail({
        email: user.email,
        subject: "JACKSTEVE | TERMINAL ACTIVATION CODE",
        html: `
          <div style="font-family:sans-serif; border-top:4px solid #FFCC00; padding:20px; background-color:#f9f9f9;">
            <h2 style="font-style:italic; color:#1a1a1a;">IDENTITY VERIFICATION</h2>
            <p>Welcome to the Jacksteve Logistics Loop.</p>
            <p>Your activation code is: <b style="font-size:28px; color:#000; letter-spacing:2px;">${otp}</b></p>
            <p>Enter this code in the terminal to activate your partner profile.</p>
            <p style="font-size:10px; color:#888; margin-top:20px; border-top:1px solid #ddd; padding-top:10px;">
              Note: This replaces any previous code sent. Code expires in 10 minutes.
            </p>
          </div>`,
      });

      return res.status(201).json({
        message: "Partner profile initialized. Activation code dispatched to email.",
      });
    } catch (emailError) {
      console.error("EMAIL_DISPATCH_ERROR:", emailError);
      // We still return 201 because the user was saved, but we warn them about the email failure
      return res.status(201).json({
        message: "Profile saved, but email dispatch failed. Check SMTP terminal settings.",
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
// @desc    Verify OTP & Activate Partner Terminal
// @route   POST /api/auth/verify
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. NORMALIZE: Ensure email is lowercase/trimmed and OTP is a string
    const cleanEmail = email ? email.toLowerCase().trim() : "";
    const cleanOtp = otp ? otp.toString().trim() : "";

    // 2. Find the user with matching normalized email and active OTP
    const user = await User.findOne({
      email: cleanEmail,
      otpCode: cleanOtp,
      otpExpire: { $gt: Date.now() }, // Check if code is still valid
    });

    // 3. Handle failure (This returns the 400 error you saw)
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "INVALID OR EXPIRED CODE: Verification failed. Request a new one.",
      });
    }

    // 4. Update User Status to Active
    user.isVerified = true;
    user.otpCode = undefined; 
    user.otpExpire = undefined; 
    await user.save();

    // 5. Return Session Data (For Auto-Login)
    return res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id), 
      message: "TERMINAL ACTIVATED: ACCESS GRANTED",
    });

    console.log(`[TERMINAL ACTIVATED]: ${user.name} (${user.role}) is now online.`);
  } catch (error) {
    console.error("VERIFICATION_SYSTEM_ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Terminal Error during Activation.",
    });
  }
};

// @desc    Authenticate Partner & Verify Role Integrity
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // 1. Validation: Ensure fields exist before processing
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "TERMINAL ERROR: Email and Password are required.",
      });
    }

    // 2. Find user (Normalized Search)
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    // 3. Validate credentials
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "INVALID CREDENTIALS: System Access Denied.",
      });
    }

    // 4. ROLE INTEGRITY CHECK
    // If your frontend sends a role, we verify it matches the DB
    if (role) {
      const requestedRole = role.toString().toUpperCase().trim();
      const actualRole = user.role.toUpperCase();

      // Admins are bypass-authorized, others must match exactly
      if (actualRole !== "ADMIN" && actualRole !== requestedRole) {
        return res.status(403).json({
          success: false,
          message: `ACCESS DENIED: This account is registered as ${user.role}.`,
        });
      }
    }

    // 5. Verification check
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "TERMINAL INACTIVE: Please verify your email to unlock access.",
      });
    }

    // 6. Success response
    console.log(`[ACCESS GRANTED]: ${user.name} (${user.role}) online.`);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
    
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
  // In registerUser
const cleanEmail = email.toLowerCase().trim();

// ... then use cleanEmail to create the user

  const user = await User.findOne({ email: req.body.cleanEmail });
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

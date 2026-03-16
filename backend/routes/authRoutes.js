import express from "express";
import { 
  registerUser, 
  loginUser, 
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";

// Security & Validation Gatekeepers
import { validateAuth } from "../Middleware/validationMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Onboard a new Partner & Dispatch OTP
 */
router.post("/register", validateAuth, registerUser);

/**
 * @route   POST /api/auth/verify
 * @desc    Verify OTP and activate the Partner profile
 */
router.post("/verify", verifyEmail);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate and enter the System (Requires Verified Email)
 */
router.post("/login", validateAuth, loginUser);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Request a 6-digit Reset Token via Email
 */
router.post("/forgot-password", forgotPassword);

/**
 * @route   PUT /api/auth/reset-password/:token
 * @desc    Update Password using the dispatched Reset Token
 */
router.put("/reset-password/:token", resetPassword);

/**
 * @route   POST /api/auth/logout
 * @desc    Clear Session / Terminate Connection
 */
router.post("/logout", logoutUser);

export default router;

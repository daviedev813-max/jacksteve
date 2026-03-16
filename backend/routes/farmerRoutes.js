import express from "express";
import {
  createFarmer,
  getFarmers,
  getFarmerById
} from "../controllers/farmerController.js";

// Import your Security Gatekeepers
import { protect, authorize } from "../Middleware/authMiddleware.js";
import { validateFarmer } from "../Middleware/validationMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/farmers/sell-maize
 * @access  Private (Farmer Only)
 */
router.post(
  "/sell-maize", 
  protect, 
  authorize("FARMER"), 
  validateFarmer, 
  createFarmer
);

/**
 * @route   GET /api/farmers
 * @desc    Farmers see their own list; Admins see the full regional queue
 * @access  Private (Farmer, Admin)
 */
router.get(
  "/", 
  protect, 
  authorize("FARMER", "ADMIN"), 
  getFarmers
);

/**
 * @route   GET /api/farmers/:id
 * @access  Private (Owner or Admin only)
 */
router.get(
  "/:id", 
  protect, 
  authorize("FARMER", "ADMIN"), 
  getFarmerById
);

export default router;

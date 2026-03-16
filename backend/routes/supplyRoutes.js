import express from "express";
import {
  createSupplyRequest,
  getSupplyRequests,
  getSupplyById,
  getBackhaulOpportunities,
  getMillerStats, // Added
  assignBackhaulLoad,
} from "../controllers/supplyController.js";

import { protect, authorize } from "../Middleware/authMiddleware.js";
// Note: Ensure your validation middleware matches the new Schema fields
import { validateSupplyRequest } from "../Middleware/validationMiddleware.js";

const router = express.Router();

/**
 * 🛰️ STATIC INTELLIGENCE ROUTES
 * Must be defined ABOVE /:id to prevent routing conflicts
 */

// For the "Backhaul Loop" Page
router.get(
  "/backhaul-opportunities",
  protect,
  authorize("MILLER", "ADMIN"),
  getBackhaulOpportunities,
);

// For the Dashboard Stats and "Financial Terminal" Page
router.get(
  "/finance-stats",
  protect,
  authorize("MILLER", "ADMIN"),
  getMillerStats,
);

/**
 * 📦 CORE LOGISTICS ROUTES
 */

router.post(
  "/request",
  protect,
  authorize("MILLER", "ADMIN"),
  validateSupplyRequest,
  createSupplyRequest,
);

router.get("/", protect, authorize("MILLER", "ADMIN"), getSupplyRequests);

/**
 * 🚛 ACTION ROUTES
 */

// For "Closing the Loop" on the Backhaul Page
router.post(
  "/assign-backhaul/:id",
  protect,
  authorize("MILLER", "ADMIN"),
  assignBackhaulLoad,
);

// Detailed Manifest View
router.get("/:id", protect, authorize("MILLER", "ADMIN"), getSupplyById);

export default router;

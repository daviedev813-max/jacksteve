import express from "express";
import { 
  getFleetStatus, 
  updateTelemetry, 
  assignMission, 
  completeMission, 
  trackInbound 
} from "../controllers/fleetController.js";

// Security Gatekeepers
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/fleet/status
 * @desc    Get full fleet overview (War Room)
 * @access  Private (Admin, Miller)
 */
router.get("/status", protect, authorize("ADMIN", "MILLER"), getFleetStatus);

/**
 * @route   GET /api/fleet/track
 * @desc    Miller Intelligence: Track specific inbound unit
 * @access  Private (Miller)
 */
router.get("/track", protect, authorize("MILLER"), trackInbound);

/**
 * @route   POST /api/fleet/assign
 * @desc    Dispatch a truck to a harvest mission
 * @access  Private (Admin Only)
 */
router.post("/assign", protect, authorize("ADMIN"), assignMission);

/**
 * @route   PATCH /api/fleet/:id/telemetry
 * @desc    Update live GPS and Fuel data
 * @access  Private (Admin Only)
 */
router.patch("/:id/telemetry", protect, authorize("ADMIN"), updateTelemetry);

/**
 * @route   POST /api/fleet/:id/complete
 * @desc    Close mission manifest and trigger backhaul logic
 * @access  Private (Admin Only)
 */
router.post("/:id/complete", protect, authorize("ADMIN"), completeMission);

export default router;

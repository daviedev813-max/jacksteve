import express from "express";
import {
  createContact,
  getContacts
} from "../controllers/contactController.js";

// Security Gatekeepers
import { protect, authorize } from "../Middleware/authMiddleware.js";
import { validateContact } from "../Middleware/validationMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/contact/create
 * @desc    Public Terminal: Inbound Inquiry Manifest
 * @access  Public
 */
router.post("/create", validateContact, createContact);

/**
 * @route   GET /api/contact/list
 * @desc    Admin Command: Review Inquiry Queue
 * @access  Private (Admin Only)
 */
router.get(
  "/list", 
  protect, 
  authorize("ADMIN"), 
  getContacts
);

export default router;

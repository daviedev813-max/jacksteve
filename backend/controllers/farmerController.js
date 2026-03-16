import Farmer from "../models/Farmer.js";

/* 
   POST /api/farmers/sell-maize 
   @desc Create a harvest entry linked to the logged-in user
*/
export const createFarmer = async (req, res, next) => {
  try {
    // Identity (name/phone) is already in req.user from 'protect' middleware
    const { location, maizeQuantity, grade } = req.body;

    const harvest = await Farmer.create({
      user: req.user._id, // The Uplink to User account
      location,
      maizeQuantity,
      grade: grade || 'UNGRADED',
      status: 'PENDING_PICKUP' 
    });

    res.status(201).json({
      success: true,
      message: "Harvest Manifest Initialized in Jacksteve System",
      data: harvest
    });
  } catch (error) {
    next(error);
  }
};

/* 
   GET /api/farmers 
   @desc Role-based View: Farmers see own history, Admins see full Regional Queue
*/
export const getFarmers = async (req, res, next) => {
  try {
    let query;

    // ADMIN sees everything with Producer details populated
    if (req.user.role === 'ADMIN') {
      query = Farmer.find().populate('user', 'name email profile');
    } else {
      // FARMER sees only their own missions
      query = Farmer.find({ user: req.user._id });
    }

    const farmers = await query.sort({ createdAt: -1 });

    res.json({
      success: true,
      count: farmers.length,
      data: farmers
    });
  } catch (error) {
    next(error);
  }
};

/* 
   GET /api/farmers/:id 
   @desc Get specific manifest details with full Producer profile attached
*/
export const getFarmerById = async (req, res, next) => {
  try {
    // Populate user to get name/phone for the Dispatch Note or Receipt
    const farmer = await Farmer.findById(req.params.id).populate('user', 'name email profile');

    if (!farmer) {
      return res.status(404).json({ success: false, message: "Manifest not found" });
    }

    // SECURITY: Ensure Farmers only access their own data
    if (farmer.user._id.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        success: false, 
        message: "Access Denied: Terminal restricted to manifest owner." 
      });
    }

    res.json({ success: true, data: farmer });
  } catch (error) {
    next(error);
  }
};

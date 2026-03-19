import { validate } from 'deep-email-validator';
// Tactical Email Regex: Ensures format is name@domain.com
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Auth: Register/Login Validation
export const validateAuth = async (req, res, next) => {
    const { email, password } = req.body || {};
    
    // 1. Check for missing fields
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: "Credentials required for System Access" 
        });
    }

    // 2. [SIMPLIFIED] Validate Email Format only
    // Deep validation (SMTP check) is blocked by Render Free Tier
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false, 
            message: "Invalid Comms Email: Please enter a valid operational address" 
        });
    }

    // 3. Validate Password Strength
    if (password.length < 6) {
        return res.status(400).json({ 
            success: false, 
            message: "Insecure Passkey: Minimum 6 characters required" 
        });
    }

    next();
};

// Fleet: Mission Assignment Validation
export const validateMission = (req, res, next) => {
    const { truckId, harvestId } = req.body || {};

    if (!truckId || !harvestId) {
        return res.status(400).json({ 
            success: false, 
            message: "Truck ID and Harvest Manifest ID required for Dispatch" 
        });
    }
    next();
};

export const validateFarmer = (req, res, next) => {
    const { phone, location, maizeQuantity } = req.body || {};
    // Note: 'name' is now pulled from the Auth User, so we don't strictly need it in body
    if (!phone || !location || !maizeQuantity) {
        return res.status(400).json({ 
            success: false, 
            message: "Incomplete Harvest Manifest: Phone, Location, and Quantity required" 
        });
    }
    next();
};

export const validateSupplyRequest = (req, res, next) => {
    const { quantity, location } = req.body || {};
    // Note: Company details are now pulled from the Miller's Auth Profile
    if (!quantity || !location) {
        return res.status(400).json({ 
            success: false, 
            message: "Incomplete Supply Order: Quantity and Location required" 
        });
    }
    next();
};

export const validateContact = (req, res, next) => {
    const { name, email, role, message } = req.body || {};

    if (!name || !email || !role || !message) {
        return res.status(400).json({ 
            success: false, 
            message: "All fields including Operational Role are required" 
        });
    }
    next();
};

import Truck from "../models/Truck.js";
import Farmer from "../models/Farmer.js";

/**
 * @desc    Update Truck Location & Fuel (Live Telemetry)
 * @route   PATCH /api/fleet/:id/telemetry
 * @access  Private (Admin)
 */
export const updateTelemetry = async (req, res, next) => {
  try {
    const { lat, lng, fuel, locationName, status } = req.body;
    
    const truck = await Truck.findOneAndUpdate(
      { truckId: req.params.id },
      { 
        "location.coordinates": { lat, lng },
        "location.name": locationName,
        "telemetry.fuelLevel": Math.max(0, Math.min(100, fuel)), // Clamp 0-100
        status 
      },
      { new: true }
    );

    if (!truck) return res.status(404).json({ success: false, message: "Truck not found" });
    
    res.json({ success: true, data: truck });
  } catch (error) { 
    next(error); 
  }
};

/**
 * @desc    Get All Active Fleet Units (War Room View)
 * @route   GET /api/fleet/status
 * @access  Private (Admin, Miller)
 */
export const getFleetStatus = async (req, res, next) => {
  try {
    const fleet = await Truck.find().sort({ truckId: 1 });
    res.json({ success: true, count: fleet.length, data: fleet });
  } catch (error) { 
    next(error); 
  }
};

/**
 * @desc    Assign Truck to a Harvest or Supply Order (Mission Start)
 * @route   POST /api/fleet/assign
 * @access  Private (Admin)
 */
export const assignMission = async (req, res, next) => {
  try {
    const { truckId, harvestId, cargoType } = req.body;

    const truck = await Truck.findOne({ truckId });
    if (!truck || truck.status !== "IDLE") {
      return res.status(400).json({ success: false, message: "Unit is busy or offline." });
    }

    const harvest = await Farmer.findById(harvestId);
    if (!harvest) return res.status(404).json({ success: false, message: "Harvest not found." });

    // 1. Lock Truck into Mission
    truck.status = "ON_ROUTE";
    truck.activeMission = {
      cargoType: cargoType || "MAIZE",
      destination: harvest.location,
    };
    await truck.save();

    // 2. Update Harvest Manifest
    harvest.status = "IN_TRANSIT";
    await harvest.save();

    res.json({ 
      success: true, 
      message: `Mission Confirmed: ${truckId} dispatched to ${harvest.location}`,
      data: truck 
    });
  } catch (error) { 
    next(error); 
  }
};

/**
 * @desc    Complete Mission & Trigger Backhaul Logic (The Loop)
 * @route   POST /api/fleet/:id/complete
 * @access  Private (Admin)
 */
export const completeMission = async (req, res, next) => {
  try {
    const truck = await Truck.findOne({ truckId: req.params.id });
    if (!truck) return res.status(404).json({ message: "Truck not found" });

    const previousCargo = truck.activeMission.cargoType;
    const dropoffLocation = truck.location.name;
    
    // Reset Truck to IDLE
    truck.status = "IDLE";
    truck.activeMission = { cargoType: "NONE", destination: "N/A" };
    await truck.save();

    // BACKHAUL INTELLIGENCE: Auto-suggest industrial load based on drop-off
    let backhaulAlert = null;
    if (previousCargo === "MAIZE") {
      backhaulAlert = `UNIT EMPTY AT ${dropoffLocation.toUpperCase()}. Suggesting CEMENT backhaul from nearest depot.`;
    }

    res.json({ 
      success: true, 
      message: "Mission manifest closed.", 
      backhaulAlert 
    });
  } catch (error) { 
    next(error); 
  }
};

/**
 * @desc    Miller Intelligence: Track specific inbound tonnage
 * @route   GET /api/fleet/track
 * @access  Private (Miller)
 */
export const trackInbound = async (req, res, next) => {
  try {
    // Finds truck currently destined for the logged-in Miller's facility
    const truck = await Truck.findOne({ 
      "activeMission.destination": req.query.location,
      status: { $in: ["ON_ROUTE", "DELIVERING"] }
    });

    if (!truck) return res.status(404).json({ message: "No active inbound units for this location." });

    res.json({ 
      success: true, 
      data: { 
        unit: truck.truckId, 
        currentPos: truck.location.name, 
        coordinates: truck.location.coordinates,
        fuel: truck.telemetry.fuelLevel 
      } 
    });
  } catch (error) { 
    next(error); 
  }
};

import SupplyRequest from "../models/SupplyRequest.js";
import Truck from "../models/Truck.js"; 
/*
  POST /api/supply/request
  @desc Initialize an Industrial Bulk Order (Miller Terminal)
*/
export const createSupplyRequest = async (req, res, next) => {
  try {
    const { quantity, dropOffLocation, commodityType, isBackhaulEligible, qualityMetrics } = req.body;

    const request = await SupplyRequest.create({
      user: req.user._id, 
      quantity,
      dropOffLocation,
      commodityType, // Schema handles default "WHITE MAIZE"
      isBackhaulEligible,
      qualityMetrics, // Capture grain specs for Procurement page
      status: 'PENDING_DISPATCH' 
    });

    res.status(201).json({
      success: true,
      message: "Industrial Manifest Initialized",
      data: request
    });
  } catch (error) {
    next(error);
  }
};

/*
  GET /api/supply
  @desc Role-based list: Includes assignedTruck for live Fleet GPS on Dashboard
*/
export const getSupplyRequests = async (req, res, next) => {
  try {
    const filter = req.user.role === 'ADMIN' ? {} : { user: req.user._id };

    const requests = await SupplyRequest.find(filter)
      .populate('user', 'name email profile')
      .populate('assignedTruck') // 🛰️ Essential for "Live Tracking" sidebar item
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

/*
  GET /api/supply/backhaul-opportunities
  @desc Logic for the "Backhaul Loop" Page
*/
export const getBackhaulOpportunities = async (req, res, next) => {
  try {
    // Finds trucks currently at/near the Miller's terminal that haven't secured a return load
    const opportunities = await SupplyRequest.find({
      user: req.user._id,
      isBackhaulEligible: true,
      isLoopClosed: false,
      status: { $in: ['DELIVERED', 'IN_TRANSIT'] }
    }).populate('assignedTruck');

    res.json({ success: true, data: opportunities });
  } catch (error) {
    next(error);
  }
};

/*
  GET /api/supply/finance-stats
  @desc Aggregates data for the "Financial Terminal" Sidebar item
*/
export const getMillerStats = async (req, res, next) => {
  try {
    const stats = await SupplyRequest.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalTonnage: { $sum: "$quantity" },
          totalSpent: { $sum: "$estimatedCost" },
          activeTrucks: { 
            $sum: { $cond: [{ $in: ["$status", ["LOADING", "IN_TRANSIT"]] }, 1, 0] } 
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0] || { totalTonnage: 0, totalSpent: 0, activeTrucks: 0 }
    });
  } catch (error) {
    next(error);
  }
};

/*
  GET /api/supply/:id
  @desc Fetch specific order details with full Truck telemetry
*/
export const getSupplyById = async (req, res, next) => {
  try {
    const request = await SupplyRequest.findById(req.params.id)
      .populate('user', 'name email profile')
      .populate('assignedTruck');

    if (!request) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (request.user._id.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: "Access Denied" });
    }

    res.json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};
/*
  POST /api/supply/assign-backhaul/:id
  @desc Finalize the "Loop": Assigns a return load to an emptying truck
*/
export const assignBackhaulLoad = async (req, res, next) => {
  try {
    const { returnCommodity, returnQuantity } = req.body;

    // 1. Find the primary Maize manifest
    const manifest = await SupplyRequest.findById(req.params.id);

    if (!manifest) {
      return res.status(404).json({ success: false, message: "Original manifest not found" });
    }

    if (!manifest.assignedTruck) {
      return res.status(400).json({ success: false, message: "No truck assigned to this manifest to loop." });
    }

    // 2. UPDATE THE MANIFEST: Close the loop and apply backhaul discount
    manifest.isLoopClosed = true;
    manifest.status = 'IN_TRANSIT'; // Re-activating for return leg
    manifest.estimatedCost = manifest.estimatedCost * 0.85; // 15% Industrial Savings applied
    await manifest.save();

    // 3. UPDATE THE TRUCK: Flip status to loading the return cargo
    await Truck.findByIdAndUpdate(manifest.assignedTruck, {
      status: 'LOADING',
      "activeMission.cargoType": returnCommodity || "CEMENT",
      "telemetry.tonnage": returnQuantity || manifest.quantity
    });

    res.json({
      success: true,
      message: `Backhaul Loop Closed: Unit assigned to ${returnCommodity || 'CEMENT'}`,
      data: manifest
    });
  } catch (error) {
    next(error);
  }
};


import mongoose from "mongoose";

const truckSchema = new mongoose.Schema(
  {
    truckId: { type: String, required: true, unique: true }, // e.g., "JS-01"
    model: { type: String, default: "Actros Prime" },
    status: { 
      type: String, 
      enum: ["IDLE", "LOADING", "ON_ROUTE", "DELIVERING", "MAINTENANCE"], 
      default: "IDLE" 
    },
    currentDriver: { type: String, default: "N/A" },
    location: {
      name: { type: String, default: "Nairobi Yard" },
      coordinates: {
        lat: { type: Number, default: -1.286389 },
        lng: { type: Number, default: 36.817223 }
      }
    },
    telemetry: {
      fuelLevel: { type: Number, min: 0, max: 100, default: 100 },
      tonnage: { type: Number, default: 0 }, // Current load in Tons
      lastService: { type: Date, default: Date.now }
    },
    activeMission: {
      cargoType: { type: String, enum: ["MAIZE", "CEMENT", "NONE"], default: "NONE" },
      destination: String
    }
  },
  { timestamps: true }
);

const Truck = mongoose.model("Truck", truckSchema);
export default Truck;

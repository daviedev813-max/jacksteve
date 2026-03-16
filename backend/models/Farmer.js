import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema(
  {
    // 🔗 THE UPLINK: Connects this specific load to a Farmer's User Account
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // 📍 COLLECTION TERMINAL
    location: {
      type: String,
      required: true,
      trim: true
    },

    // 🌽 HARVEST PAYLOAD
    maizeQuantity: {
      type: Number,
      required: true,
      min: 1 // Measured in Bags
    },

    grade: {
      type: String,
      enum: ["GRADE 1", "GRADE 2", "UNGRADED"],
      default: "UNGRADED",
      uppercase: true
    },

    // 🚛 LOGISTICS TELEMETRY: Tracks the load through the Jacksteve Fleet
    status: {
      type: String,
      enum: ["PENDING_PICKUP", "IN_TRANSIT", "COLLECTED", "CANCELLED"],
      default: "PENDING_PICKUP"
    },

    // 💰 Estimated value for the Farmer Dashboard stats
    estimatedValue: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true // Captures 'Created At' for the Dispatch Queue
  }
);

// Tactical Indexing: Optimizes the 'Harvest Control' Dashboard
farmerSchema.index({ status: 1, user: 1, createdAt: -1 });

const Farmer = mongoose.model("Farmer", farmerSchema);

export default Farmer;

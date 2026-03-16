import mongoose from "mongoose";

const supplyRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTruck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      default: null,
    },
    commodityType: {
      type: String,
      required: true,
      enum: ["WHITE MAIZE", "YELLOW MAIZE", "ANIMAL FEED", "CEMENT", "GENERAL"],
      default: "WHITE MAIZE",
      uppercase: true,
    },
    // 🌾 SPECIFIC GRADE FOR WHITE MAIZE
    // This allows you to track "WHITE MAIZE GRADE 1" vs "WHITE MAIZE GRADE 2"
    grade: {
      type: String,
      enum: ["GRADE_1", "GRADE_2", "REJECT", "UNGRADED"],
      default: "UNGRADED",
      uppercase: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    qualityMetrics: {
      moistureContent: { type: Number, default: 0 },
      aflatoxinLevel: { type: Number, default: 0 },
    },
    dropOffLocation: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: [
        "PENDING_DISPATCH",
        "LOADING",
        "IN_TRANSIT",
        "DELIVERED",
        "CANCELLED",
      ],
      default: "PENDING_DISPATCH",
    },
    isBackhaulEligible: { type: Boolean, default: true },
    isLoopClosed: { type: Boolean, default: false },
    estimatedCost: { type: Number, default: 0 },
    paymentStatus: {
      type: String,
      enum: ["UNPAID", "PARTIAL", "PAID"],
      default: "UNPAID",
    },
    requestedPickupDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // Allows frontend to see "Success Summary"
    toObject: { virtuals: true },
  },
);

// 🚀 SUCCESS FEATURE: Virtual summary for the frontend
// When the order is saved, the frontend can access "request.summary"
supplyRequestSchema.virtual("summary").get(function () {
  return `Manifest #${this._id.toString().slice(-6).toUpperCase()} for ${this.quantity}T of ${this.commodityType} (${this.grade}) initialized successfully.`;
});

supplyRequestSchema.index({
  status: 1,
  user: 1,
  assignedTruck: 1,
  createdAt: -1,
});

const SupplyRequest = mongoose.model("SupplyRequest", supplyRequestSchema);
export default SupplyRequest;

import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },

    // Matches the "I am a..." dropdown in your frontend form
    role: {
      type: String,
      enum: ["FARMER / PRODUCER", "MILLER / PROCESSOR", "LOGISTICS PARTNER", "RETAILER", "GUEST"],
      default: "GUEST"
    },

    message: {
      type: String,
      required: true
    },

    // Administrative tracking for the Jacksteve Dispatch team
    status: {
      type: String,
      enum: ["UNREAD", "IN_REVIEW", "RESOLVED", "ARCHIVED"],
      default: "UNREAD"
    }
  },
  {
    timestamps: true
  }
);

// Indexing for faster admin searches by role or status
contactSchema.index({ role: 1, status: 1 });

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;

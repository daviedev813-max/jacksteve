import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["FARMER", "MILLER", "ADMIN"],
      default: "FARMER",
    },

    // Security & Verification Layers
    isVerified: { type: Boolean, default: false },
    otpCode: String,
    otpExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Business-specific metadata for the Jacksteve Loop
    profile: {
      location: String,
      companyName: String,
      creditLimit: { type: Number, default: 0 }, // Specific to Miller role
    },
  },
  { timestamps: true },
);

// Hash password before saving
// models/User.js

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  // No next() needed!
});

// Method to verify password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Tactical Method: Generate a 6-digit OTP for Email Verification
userSchema.methods.getVerificationOtp = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otpCode = otp;
  this.otpExpire = Date.now() + 10 * 60 * 1000; // Valid for 10 Minutes
  return otp;
};

// Tactical Method: Generate a Reset Token for Forgotten Password
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hash it for the DB, but send the plain version to the email
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // Valid for 30 Minutes
  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;

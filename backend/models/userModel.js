import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["Admin", "Doctor", "Influencer", "Customer"],
      default: "Customer",
    },

    referralCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    walletBalance: {
      type: Number,
      default: 0,
    },

    commissionRate: {
      type: Number,
      default: 10,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "discharged", "emergency"],
      default: "active",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    // ✅ FIX: required only for customers
    dateOfBirth: {
      type: Date,
      required: function () {
        return this.role === "Customer";
      },
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    location: String,

    patientType: {
      type: String,
      enum: ["new", "regular", "vip", "emergency"],
      default: "new",
    },

    medicalHistory: [{ type: String }],
    currentMedications: [{ type: String }],
    allergies: [{ type: String }],

    emergencyContact: {
      name: { type: String },
      phone: { type: String },
    },

    insuranceProvider: String,

    tags: [{ type: String }],

    notes: String,

    // doctor fields
    hospital: String,
    experience: Number,
    consultationFee: Number,
    specialization: String,
    qualifications: String,
    availability: String,
    language: [{ type: String }],

    // influencer fields
    platform: String,
    followers: Number,
    category: String,
    socialMediaLinks: String,

    // customer fields
    occupation: String,

    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },

    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },

    // ⚠️ WARNING: avoid storing real card numbers (PCI risk)
    // keeping your structure but recommended to store token/last4 only
    paymentMethods: [
      {
        cardType: { type: String, required: true },
        cardNumber: { type: String, required: true },
        cardHolderName: { type: String, required: true },
        expiryDate: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],

    address: String,
    city: String,
    state: String,
    zipCode: Number,
  },
  { timestamps: true }
);

// ✅ password hashing middleware
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);
export default User;

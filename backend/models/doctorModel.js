import mongoose from "mongoose";
import bcrypt from "bcrypt";

const DoctorSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    dateOfBirth: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    hospital: {
      type: String,
    },
    experience: {
      type: Number,
    },
    consultationFee: {
      type: Number,
    },
    specialization: {
      type: String,
    },
    qualifications: {
      type: String,
    },
    availability: {
      type: String,
    },
    language: [
      {
        type: String,
      },
    ],
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

DoctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

const Doctor = mongoose.model("Doctor", DoctorSchema);

export default Doctor;

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const InfluencerSchema = new mongoose.Schema(
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
        role: {
            type: String,
            enum: ["Influencer"],
            default: "Influencer",
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
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        platform: {
            type: String,
        },
        followers: {
            type: Number,
        },
        category: {
            type: String,
        },
        socialMediaLinks: {
            type: String,
        },
        occupation: {
            type: String,
        },
        walletBalance: {
            type: Number,
            default: 0,
        },
        commissionRate: {
            type: Number,
            default: 10,
        },
        referralCode: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },
        twoFactorEnabled: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

InfluencerSchema.pre("save", async function (next) {
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

const Influencer = mongoose.model("Influencer", InfluencerSchema);

export default Influencer;

import Session from "../models/sessionModel.js";
import Customer from "../models/customerModel.js";
import Doctor from "../models/doctorModel.js";
import Influencer from "../models/influencerModel.js";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js"; // Keep for backward compatibility during migration
import generateToken from "../utils/generateToken.js";
import passwordCheck from "../utils/passwordCheck.js";
import { UAParser } from "ua-parser-js";

// controllers/authController.js
import bcrypt from "bcrypt";

// Signup
export const signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      userType,
      phone,
      dateOfBirth,
      address,
      city,
      state,
      zipCode,
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check in all role-specific collections
    const existingCustomer = await Customer.findOne({ email });
    const existingDoctor = await Doctor.findOne({ email });
    const existingInfluencer = await Influencer.findOne({ email });
    const existingAdmin = await Admin.findOne({ email });

    if (existingCustomer || existingDoctor || existingInfluencer || existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create user in appropriate collection based on userType
    let user;
    const userData = {
      firstName,
      lastName,
      email,
      password,
      phone,
      dateOfBirth,
      address,
      city,
      state,
      zipCode,
    };

    if (userType === 'doctor') {
      user = await Doctor.create(userData);
    } else if (userType === 'influencer') {
      user = await Influencer.create(userData);
    } else if (userType === 'admin') {
      user = await Admin.create(userData);
    } else {
      // Default to Customer for 'user' or any other type
      user = await Customer.create(userData);
    }

    // Auto-login logic
    const token = generateToken(user._id);

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const parser = new UAParser(userAgent);
    const deviceInfo = parser.getResult();

    const session = await Session.create({
      user: user._id,
      userAgent,
      ipAddress: ip,
      isValid: true,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      token,
      deviceInfo,
    });

    return res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "User registered successfully",
        data: user, // Retain for backward compatibility in reducers if needed
        session, // Added session for auto-login
        user: { // Sending user info back useful for frontend immediate state update
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role
        }
      });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password required",
    });
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  const userAgent = req.headers["user-agent"];

  try {
    // Search across all role-specific collections
    let user = await Customer.findOne({ email });
    let resolvedRole = user ? "Customer" : null;
    if (!user) {
      user = await Doctor.findOne({ email });
      resolvedRole = user ? "Doctor" : null;
    }
    if (!user) {
      user = await Influencer.findOne({ email });
      resolvedRole = user ? "Influencer" : null;
    }
    if (!user) {
      user = await Admin.findOne({ email });
      resolvedRole = user ? (user.role || "admin") : null;
    }

    // Fallback to old User collection for backward compatibility
    if (!user) {
      user = await User.findOne({ email });
      resolvedRole = user ? user.role : resolvedRole;
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    const parser = new UAParser(userAgent);
    const deviceInfo = parser.getResult();

    const session = await Session.create({
      user: user._id,
      userAgent,
      ipAddress: ip,
      isValid: true,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      token,
      deviceInfo,
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message: "login successful",
        session,
        user: { // Sending user info back useful for frontend immediate state update
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role || resolvedRole
        }
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Backend error",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).clearCookie("token").json({
      message: "logout",
    });
  } catch (error) {
    res.status(500).clearCookie("token").json({
      message: "server error",
    });
  }
};
export const check = async (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    console.log(error + " check problem");

    res.status(500).json({
      message: "server error",
    });
  }
};
export const resetPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(403).json({
      message: "All Detail Required",
    });
  }
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    const isMatch = await passwordCheck(oldPassword, user.password);
    if (!isMatch) {
      return res.status(403).json({
        message: "Old Password is Incorrect",
      });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error + " resetPassword problem");
    res.status(500).json({
      message: "server error",
    });
  }
};

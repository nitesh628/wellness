import User from "../models/userModel.js";
import Influencer from "../models/influencerModel.js";

// Get all settings (Profile, Business, Security)
export const getInfluencerSettings = async (req, res) => {
  try {
    console.log("Fetching settings for user:", req.user._id);

    // Try to find in Influencer collection first, then fallback to User
    let user = await Influencer.findById(req.user._id).select("-password");
    if (!user) {
      user = await User.findById(req.user._id).select("-password");
    }

    if (!user) {
      console.log("User not found in any collection");
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("User found:", user.email);

    // Structure data to match frontend expectations
    const settingsData = {
      profile: {
        name: `${user.firstName} ${user.lastName}`,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        niche: user.category || "",
        followers: user.followers || 0,
        engagement: user.engagementRate || 0, // Ensure field exists in model or calculate it
        platform: user.platform || "",
        location: user.location || "",
        bio: user.notes || "", // Using 'notes' field for bio, or add 'bio' to schema
        avatar: user.imageUrl || "",
        languages: user.language || [],
        collaborationRate: user.collaborationRate || 0,
        sponsoredPostRate: user.sponsoredPostRate || 0 // Add to schema if missing
      },
      business: {
        brandName: user.brandName || "", // Add to schema
        businessAddress: user.businessAddress || "", // Add to schema
        businessPhone: user.businessPhone || "", // Add to schema
        businessEmail: user.businessEmail || "", // Add to schema
        website: user.website || "", // Add to schema
        taxId: user.taxId || "", // Add to schema
        businessType: user.businessType || "", // Add to schema
        socialMedia: user.socialMediaLinks ? JSON.parse(user.socialMediaLinks) : {
          instagram: "",
          tiktok: "",
          youtube: "",
          twitter: ""
        },
        averagePostTime: user.averagePostTime || 0, // Add to schema
        maxCollaborationsPerMonth: user.maxCollaborationsPerMonth || 0, // Add to schema
        brandPartnerships: user.brandPartnerships ?? true // Add to schema
      },
      security: {
        twoFactorAuth: user.twoFactorEnabled,
        loginAlerts: user.loginAlerts ?? false, // Add to schema
        sessionTimeout: user.sessionTimeout || 30, // Add to schema
        passwordExpiry: user.passwordExpiry || 90, // Add to schema
        ipWhitelist: user.ipWhitelist || [], // Add to schema
        auditLogs: user.auditLogs ?? true, // Add to schema
        dataEncryption: user.dataEncryption ?? true, // Add to schema
        backupFrequency: user.backupFrequency || "daily" // Add to schema
      }
    };

    res.status(200).json({ success: true, data: settingsData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Profile Settings
export const updateProfileSettings = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      niche,
      followers,
      engagement,
      platform,
      location,
      bio,
      languages,
      collaborationRate,
      sponsoredPostRate
    } = req.body;

    const nameParts = name ? name.split(" ") : ["", ""];
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    // Try Influencer model first
    let updatedUser = await Influencer.findByIdAndUpdate(
      req.user._id,
      {
        firstName: firstName || req.user.firstName,
        lastName: lastName || req.user.lastName,
        phone,
        category: niche,
        followers,
        platform,
        location,
        occupation: bio,
        collaborationRate,
        sponsoredPostRate
      },
      { new: true, runValidators: true }
    ).select("-password");

    // Fallback to User model
    if (!updatedUser) {
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          firstName: firstName || req.user.firstName,
          lastName: lastName || req.user.lastName,
          phone,
          category: niche,
          followers,
          platform,
          location,
          notes: bio,
          language: languages,
          collaborationRate,
          sponsoredPostRate
        },
        { new: true, runValidators: true }
      ).select("-password");
    }

    res.status(200).json({ success: true, message: "Profile updated", data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Business Settings
export const updateBusinessSettings = async (req, res) => {
  try {
    const {
      brandName,
      businessAddress,
      businessPhone,
      businessEmail,
      website,
      taxId,
      businessType,
      socialMedia,
      averagePostTime,
      maxCollaborationsPerMonth,
      brandPartnerships
    } = req.body;

    // Try Influencer model first
    let updatedUser = await Influencer.findByIdAndUpdate(
      req.user._id,
      {
        socialMediaLinks: socialMedia ? JSON.stringify(socialMedia) : undefined
      },
      { new: true, runValidators: true }
    ).select("-password");

    // Fallback to User model
    if (!updatedUser) {
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          socialMediaLinks: socialMedia ? JSON.stringify(socialMedia) : undefined
        },
        { new: true, runValidators: true }
      ).select("-password");
    }

    res.status(200).json({ success: true, message: "Business settings updated", data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Security Settings
export const updateSecuritySettings = async (req, res) => {
  try {
    const {
      twoFactorAuth,
      loginAlerts,
      sessionTimeout,
      passwordExpiry,
      ipWhitelist,
      auditLogs,
      dataEncryption,
      backupFrequency
    } = req.body;

    // Try Influencer model first
    let updatedUser = await Influencer.findByIdAndUpdate(
      req.user._id,
      {
        twoFactorEnabled: twoFactorAuth
      },
      { new: true, runValidators: true }
    ).select("-password");

    // Fallback to User model
    if (!updatedUser) {
      updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          twoFactorEnabled: twoFactorAuth,
          loginAlerts,
          sessionTimeout,
          passwordExpiry,
          ipWhitelist,
          auditLogs,
          dataEncryption,
          backupFrequency
        },
        { new: true, runValidators: true }
      ).select("-password");
    }

    res.status(200).json({ success: true, message: "Security settings updated", data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Avatar (Handle file upload separately usually, or via URL here)
export const updateAvatar = async (req, res) => {
  try {
    const { avatarUrl } = req.body;

    // Try Influencer model first
    let updatedUser = await Influencer.findByIdAndUpdate(req.user._id, { imageUrl: avatarUrl });

    // Fallback to User model
    if (!updatedUser) {
      updatedUser = await User.findByIdAndUpdate(req.user._id, { imageUrl: avatarUrl });
    }

    res.status(200).json({ success: true, message: "Avatar updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
import User from "../models/userModel.js";

// Get all settings (Profile, Business, Security)
export const getInfluencerSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

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
      email, // Handle email change carefully (verification usually needed)
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

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        firstName: firstName || req.user.firstName,
        lastName: lastName || req.user.lastName,
        phone,
        category: niche,
        followers,
        engagementRate: engagement, // Ensure Schema supports this
        platform,
        location,
        notes: bio, // Mapping bio to notes or add bio field
        language: languages,
        collaborationRate,
        sponsoredPostRate // Ensure Schema supports this
      },
      { new: true, runValidators: true }
    ).select("-password");

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

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        brandName,
        businessAddress,
        businessPhone,
        businessEmail,
        website,
        taxId,
        businessType,
        socialMediaLinks: JSON.stringify(socialMedia), // Storing as JSON string
        averagePostTime,
        maxCollaborationsPerMonth,
        brandPartnerships
      },
      { new: true, runValidators: true }
    ).select("-password");

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

    const updatedUser = await User.findByIdAndUpdate(
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

    res.status(200).json({ success: true, message: "Security settings updated", data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Avatar (Handle file upload separately usually, or via URL here)
export const updateAvatar = async (req, res) => {
    try {
        const { avatarUrl } = req.body; // Expecting S3 URL from frontend after upload
        
        await User.findByIdAndUpdate(req.user._id, { imageUrl: avatarUrl });

        res.status(200).json({ success: true, message: "Avatar updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
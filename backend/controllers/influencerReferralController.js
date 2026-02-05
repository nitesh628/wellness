import User from "../models/userModel.js";
import ReferralUsage from "../models/referralUsageModel.js";

// Generate a unique referral code
const generateUniqueReferralCode = async (firstName) => {
  const maxAttempts = 10;
  let attempts = 0;

  while (attempts < maxAttempts) {
    // Create code: first 4 letters of name + 4 random digits
    const namePrefix = firstName.substring(0, 4).toUpperCase().padEnd(4, 'X');
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = namePrefix + randomNum;

    // Check if code already exists
    const existingUser = await User.findOne({ referralCode: code });
    if (!existingUser) {
      return code;
    }

    attempts++;
  }

  // Fallback: use timestamp if all attempts failed
  const timestamp = Date.now().toString().slice(-6);
  return firstName.substring(0, 2).toUpperCase() + timestamp;
};

export const getReferralDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.referralCode) {
      const code = await generateUniqueReferralCode(user.firstName);
      user.referralCode = code;
      await user.save();
    }

    const usages = await ReferralUsage.find({ influencerId: userId }).sort({ createdAt: -1 });

    const totalReferrals = usages.length;
    const completedReferrals = usages.filter(u => u.status === 'completed').length;
    const totalEarnings = usages.reduce((sum, u) => sum + (u.status !== 'cancelled' ? u.rewardAmount : 0), 0);
    const pendingReferrals = usages.filter(u => u.status === 'pending').length;

    const tableData = usages.map(usage => ({
      id: usage._id,
      referralCode: usage.referralCode,
      referredUser: usage.referredUser.name,
      referredUserEmail: usage.referredUser.email,
      referredUserPhone: usage.referredUser.phone,
      rewardAmount: usage.rewardAmount,
      status: usage.status,
      usedAt: usage.usedAt,
      completedAt: usage.completedAt,
      notes: usage.notes
    }));

    res.json({
      success: true,
      data: {
        referralCode: user.referralCode,
        commissionRate: user.commissionRate,
        stats: {
          totalReferrals,
          completedReferrals,
          totalEarnings,
          pendingReferrals,
          conversionRate: totalReferrals > 0 ? Math.round((completedReferrals / totalReferrals) * 100) : 0,
          avgCommission: totalReferrals > 0 ? Math.round(totalEarnings / totalReferrals) : 0
        },
        usageHistory: tableData
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createDummyReferral = async (req, res) => {
  try {
    const { influencerCode, customerName, customerEmail, customerPhone, orderAmount } = req.body;

    const influencer = await User.findOne({ referralCode: influencerCode });
    if (!influencer) return res.status(404).json({ message: "Invalid code" });

    const commission = (orderAmount * (influencer.commissionRate || 10)) / 100;

    const newUsage = await ReferralUsage.create({
      influencerId: influencer._id,
      referralCode: influencerCode,
      referredUser: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone || "N/A"
      },
      orderAmount: orderAmount,
      rewardAmount: commission,
      status: "completed",
      completedAt: new Date(),
      notes: "New customer purchase"
    });

    influencer.walletBalance = (influencer.walletBalance || 0) + commission;
    await influencer.save();

    res.json({ success: true, data: newUsage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import InfluencerMetric from "../models/influencerMetricModel.js";
import BrandCollaboration from "../models/brandCollaborationModel.js";
import AudienceInsight from "../models/audienceInsightModel.js";
import ReportLog from "../models/reportLogModel.js";
import User from "../models/userModel.js";

export const getReportDashboardData = async (req, res) => {
  try {
    const influencerId = req.user._id;
    const { period = "30d" } = req.query;

    let dateLimit = new Date();
    if (period === "7d") dateLimit.setDate(dateLimit.getDate() - 7);
    else if (period === "90d") dateLimit.setDate(dateLimit.getDate() - 90);
    else if (period === "1y") dateLimit.setFullYear(dateLimit.getFullYear() - 1);
    else dateLimit.setDate(dateLimit.getDate() - 30); 

    const metrics = await InfluencerMetric.find({
      influencerId,
      date: { $gte: dateLimit }
    }).sort({ date: 1 });

    const collaborations = await BrandCollaboration.find({ influencerId });
    const audience = await AudienceInsight.find({ influencerId, demographicType: "age" });
    const user = await User.findById(influencerId);

    const totalFollowers = user.followers || 0;
    
    const totalLikes = metrics.reduce((acc, curr) => acc + curr.likes, 0);
    const totalPosts = metrics.reduce((acc, curr) => acc + curr.postsCount, 0);
    const totalRevenue = metrics.reduce((acc, curr) => acc + curr.revenue, 0) + 
                         collaborations.reduce((acc, curr) => acc + curr.revenue, 0);
    
    const engagementRate = totalPosts > 0 ? ((totalLikes / totalPosts) / totalFollowers) * 100 : 0;

    const stats = {
      totalFollowers,
      totalEngagement: parseFloat(engagementRate.toFixed(2)),
      totalPosts,
      totalRevenue,
      avgLikesPerPost: totalPosts > 0 ? Math.round(totalLikes / totalPosts) : 0,
      reachRate: 12.5, 
      conversionRate: 3.2, 
      brandCollaborations: collaborations.length
    };

    res.status(200).json({
      success: true,
      data: {
        stats,
        postPerformanceData: metrics,
        audienceAnalytics: audience,
        brandCollaborations: collaborations
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReportHistory = async (req, res) => {
  try {
    const logs = await ReportLog.find({ influencerId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
      
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const generateReport = async (req, res) => {
  try {
    const { reportType, format, dateRange } = req.body;
    
    const newLog = await ReportLog.create({
      influencerId: req.user._id,
      reportName: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`,
      reportType,
      format: format.toUpperCase(),
      fileSize: "1.5 MB", 
      url: "#" 
    });

    res.status(200).json({ success: true, message: "Report generated successfully", data: newLog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Dummy Data Seeder for Testing
export const seedDummyData = async (req, res) => {
  try {
    const influencerId = req.user._id;

    await InfluencerMetric.deleteMany({ influencerId });
    await BrandCollaboration.deleteMany({ influencerId });
    await AudienceInsight.deleteMany({ influencerId });

    const metrics = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      metrics.push({
        influencerId,
        date: d,
        postsCount: Math.floor(Math.random() * 5),
        likes: Math.floor(Math.random() * 5000) + 1000,
        comments: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 200) + 10,
        reach: Math.floor(Math.random() * 20000) + 5000,
        revenue: Math.floor(Math.random() * 200)
      });
    }
    await InfluencerMetric.insertMany(metrics);

    await BrandCollaboration.insertMany([
      { influencerId, brandName: "Wellness Fuel", postsCount: 8, revenue: 12000, engagementRate: 8.5, status: "active" },
      { influencerId, brandName: "FitLife", postsCount: 6, revenue: 8500, engagementRate: 7.2, status: "completed" }
    ]);

    await AudienceInsight.insertMany([
      { influencerId, demographicType: "age", label: "18-24", count: 45000, percentage: 36.0, trend: "up" },
      { influencerId, demographicType: "age", label: "25-34", count: 38000, percentage: 30.4, trend: "up" }
    ]);

    res.json({ success: true, message: "Dummy data seeded" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
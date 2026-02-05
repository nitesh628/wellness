import jwt from "jsonwebtoken"
import Customer from "../models/customerModel.js";
import Doctor from "../models/doctorModel.js";
import Influencer from "../models/influencerModel.js";
import Admin from "../models/adminModel.js";
import User from "../models/userModel.js"; // Keep for backward compatibility during migration


export const isLogin = async (req, res, next) => {

    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');

    try {
        if (!token || token === undefined) {
            return res.status(401).json({
                message: "No Token"
            })
        }
        const tokenUser = jwt.verify(token, process.env.JWT_TOKEN)
        if (!tokenUser) {
            return res.status(401).json({
                message: "Invalid"
            })
        }

        // Search across all role-specific collections first
        let user = await Customer.findOne({ _id: tokenUser.id })
        if (!user) user = await Doctor.findOne({ _id: tokenUser.id })
        if (!user) user = await Influencer.findOne({ _id: tokenUser.id })
        if (!user) user = await Admin.findOne({ _id: tokenUser.id })

        // Fallback to old User collection for backward compatibility
        if (!user) user = await User.findOne({ _id: tokenUser.id })

        if (!user) {
            return res.status(401).json({
                message: "Not Found"
            })
        }

        req.user = user
        next()

    } catch (error) {
        console.log(error);
        res.status(500).clearCookie("token").json({ message: "islogin error" })
    }

}
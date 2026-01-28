import jwt from "jsonwebtoken"
import User from "../models/userModel.js";


export const isLogin=async(req,res,next)=>{

    const token=req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    
    try {
        if(!token|| token===undefined){
           return res.status(404).json({
                message:"No Token"
            })
        }
        const tokenUser=jwt.verify(token,process.env.JWT_TOKEN)
        if(!tokenUser){
            res.status(401).json({
                message:"Invalide"
            })
        }
        const user=await User.findOne({_id:tokenUser.id})
        if(!user){
            res.status(401).json({
                message:"Not Found"
            })
        }
        
        req.user=user
        next()

    } catch (error) {
        consoleManager.log(error);
        res.status(500).clearCookie("token").json({message:"islogin error"})
    }

}
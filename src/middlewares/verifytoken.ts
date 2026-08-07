import type { Request , Response , NextFunction } from "express";
import type { ResponseBody } from "../routes/types/interfaces.js";
import jwt from "jsonwebtoken"
import { Types } from "mongoose";
import type { JwtPayload } from "jsonwebtoken";

interface Payload extends JwtPayload {
    userId: string
    type: "refresh" | "access"
}

export const verifyToken = (
    req: Request, 
    res: Response<ResponseBody> , 
    next: NextFunction)=>{
    const header = req.headers.authorization || ""
    const token = header.split(" ")[1]
    if(!header || !token)
        return res.status(400).json({
            message: "[Error]: Token not provided or invalid",
            success: false
        })
    const secret = process.env.JWT_SECRET
    if (!secret)
        return res.status(500).json({
            message: "Server Error!",
            success: false
    })
    let payload: Payload
    try{
        payload = jwt.verify(token , secret) as Payload
        if (!payload.userId.trim() || 
        !Types.ObjectId.isValid(payload.userId.trim())
        ){
            return res.status(400).json({
                message: "[Error]: Invalid Token payload",
                success: false
            })
        }
    }catch(err){
        console.error(err)
        return res.status(500).json({
            message: "[Error]: Token not provided or invalid",
            success: false
        })
    }
    req.user = payload
    return next()
}
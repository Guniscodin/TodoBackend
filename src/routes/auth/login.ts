import router from "../helpers/router.js"
import argon2 from "argon2"
import mongoose from "mongoose"
import User from "../../schemas/user.js"
import Session from "../../schemas/session.js"
import Token from "../../schemas/token.js"
import gettoken from "../helpers/getjwttoken.js"
import { LogInCheck } from "../helpers/inputchecks.js"
import { rateLimiter } from "../../middlewares/ratelimiter.js"
import type { Request , Response } from "express"
import { AppError , catchResponse } from "../helpers/geterrortype.js"
import type {
    ResponseBodySuccess , 
    ResponseBody , 
    IUser ,
    SignUpBody
} from "../types/interfaces.js"

type RequestBody = Pick<SignUpBody, "email" | "password">
type LoginData = Omit<IUser , "password">
type responseBody = ResponseBodySuccess<{
    sessionId: string
    token: string
    refreshToken: string
    userData: LoginData
}>

export const logInRouter = router.post(
    "/login",
    rateLimiter(5,5),
    async (
    req: Request<{},{},RequestBody> ,
    res: Response<ResponseBody | responseBody>)=>{
        const check = LogInCheck(
            req.body.email , 
            req.body.password
        )
        if (!check.success){
            return res.status(400).json({
                message: check.message,
                success: false
            })
        }
        const userAgent = req.headers["user-agent"] || ""
        const now = new Date();
        const sessionExpiresAt = new Date(
            now.getTime() + 30 * 24 * 60 * 60 * 1000
        );
        const tokenExpiresAt = new Date(
            now.getTime() + 7 * 24 * 60 * 60 * 1000
        );
        const user = await User.findOne({
                email: check.email
            }).lean()
            if(!user){
                throw new AppError("INVALID_CREDENTIALS", 400)
            }
            const verify = await argon2.verify(user.password,check.password)
            if (!verify){
                throw new AppError("INVALID_CREDENTIALS", 400)
            }
        const transactionSession = await mongoose.startSession()
        try{
            const transactions = await transactionSession.withTransaction(async()=>{
                const sessions = await Session.find({
                userId: user._id,
                expiresAt: {
                    $gt: now
                }
            }).lean()
            .session(transactionSession)
            if (sessions.length > 4){
                throw new AppError("MAX_SESSIONS",409)
            }
            const newSession = new Session({
                userId: user._id,
                userAgent: userAgent,
                expiresAt: sessionExpiresAt
            })
            await newSession.save({
                session: transactionSession
            })
            const token = gettoken(user._id.toString(),"access")
            const refreshToken = gettoken(user._id.toString(), "refresh")
            if(!token.token || !refreshToken.token){
                throw new AppError("TOKEN_CREATION_FAILED",400)
            }
            const hashedRefreshToken = await argon2.hash(refreshToken.token)
            const newToken = new Token({
                sessionId: newSession._id,
                tokenHash: hashedRefreshToken,
                expiresAt: tokenExpiresAt
            })
            await newToken.save({
                session: transactionSession
            })
            const result = {
                sessionId: newSession._id.toString(),
                userData: user,
                token: token.token,
                refreshToken: refreshToken.token
            }
            return result
        })
            return res.status(201).json({
                message: "Logged in successfully!",
                success: true,
                data: transactions
            })
        }catch(err){
            if (err instanceof AppError){
                return catchResponse(res,err)
            }
            console.error(err)
            return res.status(500).json({
                message: "[Error]: Server error",
                success: false
            })
        }finally{
            await transactionSession.endSession()
        }
})
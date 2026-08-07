import router from "../helpers/router.js"
import argon2 from "argon2"
import User from "../../schemas/user.js"
import gettoken from "../helpers/getjwttoken.js"
import { LogInCheck } from "../helpers/inputchecks.js"
import { rateLimiter } from "../../middlewares/ratelimiter.js"
import type { Request , Response } from "express"
import type { ResponseBodySuccess , 
    ResponseBody , IUser } from "../types/interfaces.js"

interface RequestBody {
    email: string
    password: string
}
type LoginData = Omit<IUser , "password" | "tasks">
type responseBody = ResponseBodySuccess<{
    token: string
    refreshToken: string
    userData: LoginData
}>

export const logInRouter = router.post("/login",rateLimiter(5,5), async (
    req: Request<{},{},RequestBody> ,
    res: Response<ResponseBody | responseBody>)=>{
        const check = LogInCheck(req.body.email , req.body.password)
        if (!check.success){
            return res.status(400).json({
                message: check.message,
                success: false
            })
        }
        try{
            const user = await User.findOne({email: check.email})
            .lean()
            if (!user){
                return res.status(404).json({
                    message: "Account not found!",
                    success: false
                })
            }
            const checkPass: boolean = await argon2.verify(
                check.password,
                user.password
                )
            if (!checkPass){
                return res.status(400).json({
                    message: "[Error]: Invalid inputs!",
                    success: false
                })
            }
            const {password: _ , ...safestuff} = user
            const token = gettoken(user.user,"access")
            const refreshToken = gettoken(user.user , "refresh")
            if (!token.token || !refreshToken.token){
                return res.status(
                    500
                ).json(
                    {
                    message: "[Error]: Error while getting token!",
                    success: false
                    }
                )
            }
            return res.status(200).json({
                message: "Logged in successfully!",
                success: true,
                data: {
                    token: token.token,
                    refreshToken: refreshToken.token,
                    userData: safestuff
                }
            })
        }catch(err){
            console.error(`[ERROR]: ${err}`)
            return res.status(500).json({
                message: "[Error]: Server Error!",
                success: false
            })
        }
})
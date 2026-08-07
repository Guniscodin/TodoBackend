import router from "../helpers/router.js";
import argon2 from "argon2"
import { signUpCheck } from "../helpers/inputchecks.js";
import { rateLimiter } from "../../middlewares/ratelimiter.js"
import User from "../../schemas/user.js";
import type { Request , Response } from "express";
import type { 
    ResponseBody , 
    SignUpBody 
} from "../types/interfaces.js";

export const signInRouter = router.post(
    "/signup",
    rateLimiter(3,15) , 
    async (
    req: Request<{}, 
    ResponseBody , SignUpBody> ,
    res: Response<ResponseBody>)=>
        {
    const {email , user , password} = req.body
    const check = signUpCheck(user , email , password)
    if (!check.success){
        return res.status(
            400
        ).json({
            message: check.message,
            success: check.success
        })
    }
    try {
        const user = await User.findOne({
            $or: [
                {email: check.email},
                {user: check.username}
            ]
    })
    if (user){
        return res.status(409).json(
            {
                message: "Username or email already in use!",
                success: false
            }
        )
    }
    const hashedPass = await argon2.hash(check.password)
    await User.create({
        user: check.username,
        email: check.email,
        password: hashedPass
    })
    return res.status(
        201
    ).json({
        message: "Account created successfully!",
        success: true
    })
    }catch(err){
        console.error(`[ERROR]: ${err}`)
        return res.status(500).json(
            {
                message: "[Error]: Server Error!",
                success: false
            }
        )
    }
})
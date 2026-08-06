import { rateLimit } from "express-rate-limit"
export const rateLimiter = (limit: number , minutes: number)=>{
    return rateLimit({
        limit,
        windowMs: minutes * 60 * 1000,
        message: {
            success: false,
            message: "Too many requests. Please try again later."
        },
        standardHeaders: true,
        legacyHeaders: false
    })
}
import type { Response , Request , NextFunction } from "express";
export const checkTokenType = (
    req: Request , 
    res: Response , 
    next: NextFunction) =>{
        if (!req.user?.type || req.user.type !== "access"){
            return res.status(401).json(
                {
                    message: "[Error]: Missing token or invalid token type!",
                    success: false
                }
            )
        }
        return next()
}
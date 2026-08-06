import type { Response , Request , NextFunction } from "express"

export const verifyUser = (req: Request , res: Response , next: NextFunction) =>{
    const incomingUser = req.body.userId || req.params.userId || req.query.userId
    const realUser = req.user?.userId
    if (!incomingUser || !realUser || incomingUser !== realUser) {
        return res.status(400).json({
        message: "[Error]: Missing token or Inavlid token!",
        success: false
    });
    }
    return next()
}
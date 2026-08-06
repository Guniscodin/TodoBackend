import router from "../helpers/router.js";
import Task from "../../schemas/task.js";
import { verifyToken } from "../../middlewares/verifytoken.js";
import { verifyUser } from "../../middlewares/verifyuser.js";
import { rateLimiter } from "../../middlewares/ratelimiter.js";
import type { Response , Request } from "express";
import type { ResponseBody , ResponseBodySuccess , TaskBody } from "../types/interfaces.js";

export const getRouter = router.get(
    "/gettasks/:userId",
    rateLimiter(60,1),
    verifyToken,
    verifyUser,
    async (
        req: Request<{
            userId: string
        },ResponseBody | ResponseBodySuccess<TaskBody[]>>,
        res: Response<ResponseBody | ResponseBodySuccess<TaskBody[]>>
    )=>{
        const currentUser = req.user?.userId
        if (!currentUser){
            return res.status(400).json({
                message: "[Error]: Missing Token or User id",
                success: false
            })
        }
        try{
            const userTasks = await Task.find({
                userId: currentUser
            })
            .lean()
            .limit(100)
            return res.status(200).json({
                message: "Task retrieved successfully!",
                success: true,
                data: userTasks
            })
        }catch(err){
            console.error(err)
            return res.status(500).json({
                message: "[Error]: Server error!",
                success: false
            })
        }
    }
)
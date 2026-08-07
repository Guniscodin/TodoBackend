import router from "../helpers/router.js";
import Task from "../../schemas/task.js";
import { Types } from "mongoose";
import { verifyToken } from "../../middlewares/verifytoken.js";
import { rateLimiter } from "../../middlewares/ratelimiter.js";
import { checkTokenType } from "../../middlewares/checktokentype.js";
import type { Response , Request } from "express";
import type { QueryFilter } from "mongoose";
import type { ResponseBody , ResponseBodySuccess , TaskBody , ITask } from "../types/interfaces.js";

export const getRouter = router.get(
    "/tasks",
    rateLimiter(60,1),
    verifyToken,
    checkTokenType,
    async (
        req: Request<{},ResponseBody | ResponseBodySuccess<TaskBody[]>,{},{
            cursor?: string,
            limit?: string
        }>,
        res: Response<ResponseBody | ResponseBodySuccess<TaskBody[]>>
    )=>{
        const currentUser = req.user!.userId
        const cursor = req.query.cursor
        let limit = Number(req.query.limit) || 10
        if (limit < 1) limit = 10
        if(limit > 100){
            return res.status(400).json({
                message: "[Error]: max limit is 100!",
                success: false
            })
        }
        let payload: QueryFilter<ITask> = {
            userId: currentUser
        }
        if (cursor) {
            if (!Types.ObjectId.isValid(cursor)) {
                return res.status(400).json({
                    success: false,
                    message: "[Error]: Invalid cursor!"
                });
            }
            payload._id = {
                $lt: new Types.ObjectId(cursor)
            };
        }
        try{
            const userTasks = await Task.find(payload)
            .lean()
            .limit(limit)
            .sort({_id: -1})
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
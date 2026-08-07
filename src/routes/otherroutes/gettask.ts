import router from "../helpers/router.js";
import Task from "../../schemas/task.js";
import { Types } from "mongoose";
import { verifyToken } from "../../middlewares/verifytoken.js";
import { verifyUser } from "../../middlewares/verifyuser.js";
import { rateLimiter } from "../../middlewares/ratelimiter.js";
import { checkTokenType } from "../../middlewares/checktokentype.js";
import type { Response , Request } from "express";
import type { 
    ResponseBody , 
    ResponseBodySuccess , 
    TaskBody 
} from "../types/interfaces.js";

export const getTaskRouter = router.get(
    "/:taskId",
    rateLimiter(30,1),
    verifyToken,
    verifyUser,
    checkTokenType,
    async (
        req: Request<{taskId: string} , ResponseBody | ResponseBodySuccess<TaskBody>>,
        res: Response<ResponseBody | ResponseBodySuccess<TaskBody>>
    )=>{
        const currentUser = req.user!.userId
        const taskId = req.params.taskId.trim()
        if (!Types.ObjectId.isValid(taskId)){
            return res.status(400).json(
                {
                    message: "[Error]: Invalid TaskID",
                    success: false
                }
            )
        }
        try{
            const task = await Task.findOne({
                _id: taskId,
                userId: currentUser
            }).lean()
            if(!task){
                return res.status(404).json({
                    message: "[Error]: Task not found!",
                    success: false
                })
            }
            return res.status(200).json({
                message: "Task found!",
                success: true,
                data: task
            })
        }catch(err){
            console.error(err)
            return res.status(500).json(
                {
                    message: "[Error]: Server error",
                    success: false
                }
            )
        }
    }
)
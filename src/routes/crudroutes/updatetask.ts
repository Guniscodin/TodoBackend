import router from "../helpers/router.js";
import { verifyUser } from "../../middlewares/verifyuser.js";
import { verifyToken } from "../../middlewares/verifytoken.js";
import { rateLimiter } from "../../middlewares/ratelimiter.js";
import type { ResponseBody , ResponseBodySuccess , TaskBody } from "../types/interfaces.js";
import type { Request , Response } from "express";
import Task from "../../schemas/task.js";

export const updateRouter = router.patch(
    "/updatetask/:taskId",
    rateLimiter(30,1),
    verifyToken,
    verifyUser,
    async (
        req: Request<{
            taskId: string
        },ResponseBody | ResponseBodySuccess , TaskBody>,
        res: Response<ResponseBody | ResponseBodySuccess<TaskBody>>
    )=>{
        const taskId = req.params.taskId
        const currentUser = req.user?.userId
        const {title , content , label , priority , completed} = req.body
        const titleTrimmed = title.trim()
        const contentTrimmed = content.trim()
        const labelTrimmed = label.trim() || ""
        if (!taskId || !currentUser){
            return res.status(400).json({
                message: "[Error]: Missing Task id or User id!",
                success: false
            })
        }
        if(
            !titleTrimmed ||
            !contentTrimmed
        ){
            return res.status(400).json(
                {
                    message: "[Error]: title or content cannot be empty!",
                    success: false
                }
            )
        }
        try{
            const updateTask = await Task.findOneAndUpdate({
                _id: taskId,
                userId: currentUser
            },{
                $set: {
                    title: titleTrimmed,
                    content: contentTrimmed,
                    label: labelTrimmed,
                    priority: priority,
                    completed: completed
                }
            },{
                runValidators: true,
                lean: true,
                returnDocument: "after"
            })
            if (!updateTask) {
                return res.status(404).json({
                    success: false,
                    message: "Task not found!"
                })
                }
            return res.status(200).json({
                message: "Task updated successfully!",
                success: true,
                data: updateTask
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
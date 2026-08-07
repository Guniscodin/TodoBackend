import router from "../helpers/router.js";
import mongoose from "mongoose"
import type { Request , Response } from "express";
import type {
    ResponseBody , 
    ResponseBodySuccess 
} from "../types/interfaces.js";
import type { TaskBody } from "../types/interfaces.js";
import { verifyToken } from "../../middlewares/verifytoken.js";
import { verifyUser } from "../../middlewares/verifyuser.js";
import { rateLimiter } from "../../middlewares/ratelimiter.js";
import { checkTokenType } from "../../middlewares/checktokentype.js";
import { checkTaskFields } from "../helpers/chectaskfields.js";
import User from "../../schemas/user.js";
import Task from "../../schemas/task.js";

export const addtaskRouter = router.post(
    "/addtask",
    rateLimiter(30,1),
    verifyToken,
    verifyUser,
    checkTokenType,
    async (
        req: Request<{},ResponseBody | ResponseBodySuccess , TaskBody>, 
        res: Response<ResponseBody | ResponseBodySuccess<TaskBody>>) =>{
            const currentUser = req.user!.userId
            const title = req.body.title.trim()
            const label = req.body.label?.trim() ?? "";
            const content = req.body.content
            const priority = req.body.priority
            const check = checkTaskFields(
                title,
                content,
                priority
            )
            if (!check.success){
                return res.status(400).json(check)
            }
            const session = await mongoose.startSession()
            try{
                session.startTransaction()
                const user = await User.findOneAndUpdate({
                    _id: currentUser,
                    totalTasks: {
                        $lt: 100
                    }
                },{
                    $inc: {
                        totalTasks: 1
                    }
                },{
                    returnDocument: "after",
                    session,
                    runValidators: true
                }).lean()
                if (!user){
                    await session.abortTransaction()
                    return res.status(409).json({
                        message: "[Error]: Total task limit reached!",
                        success: false
                    })
                }
                const payload: TaskBody = {
                        userId: currentUser,
                        title,
                        label,
                        content,
                        priority,
                        completed: false
                    }
                const [newTask] = await Task.create(
                    [payload],
                    {
                        session,
                    }
                )
                await session.commitTransaction()
                return res.status(201).json({
                    message: "Task added successfully!",
                    success: true,
                    data: newTask
                })
            }catch(err){
                console.error(err)
                await session.abortTransaction()
                return res.status(500).json({
                    message: "[Error]: Server error!",
                    success: false
                })
            }finally{
                await session.endSession()
            }
    }
)

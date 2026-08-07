import router from "../helpers/router.js";
import mongoose from "mongoose";
import type { Response , Request } from "express";
import type { ResponseBody , ResponseBodySuccess } from "../types/interfaces.js";
import { verifyToken } from "../../middlewares/verifytoken.js";
import { verifyUser } from "../../middlewares/verifyuser.js";
import { rateLimiter } from "../../middlewares/ratelimiter.js";
import { checkTokenType } from "../../middlewares/checktokentype.js";
import Task from "../../schemas/task.js";
import User from "../../schemas/user.js";

export const deleteRouter = router.delete(
    "/delete/:userId",
    rateLimiter(30,1),
    verifyToken,
    verifyUser,
    checkTokenType,
    async (
        req: Request<
        {userId: string} ,
        ResponseBody | ResponseBodySuccess
        > ,
        res: Response<ResponseBody | ResponseBodySuccess>
    )=>{
        const currentUser = req.user!.userId
        const taskId = req.params.userId.trim()
        if(!mongoose.Types.ObjectId.isValid(taskId)){
            return res.status(400).json({
                message: "[Error]: Missing or invalid Id!",
                success: false
            })
        }
        const session = await mongoose.startSession()
        try{
            session.startTransaction()
            const taskDeleted = await Task.findOneAndDelete({
                _id: taskId,
                userId: currentUser
            },{
                session
            })
            if(!taskDeleted){
                await session.abortTransaction()
                return res.status(404).json({
                    message: "[Error]: Wrong Task or User id!",
                    success: false
                })
            }
            const user = await User.findOneAndUpdate({
                _id: currentUser
            },{
                $inc: {
                    totalTasks: -1
                }
            },{
                session,
                runValidators: true
            }).lean()
            if (!user){
                await session.abortTransaction()
                return res.status(404).json({
                    message: "[Error]: User not found!",
                    success: false
                })
            }
            await session.commitTransaction()
            return res.status(200).json({
                message: "Task deleted successfully!",
                success: true
            })
        }catch(err){
            console.error(err)
            await session.abortTransaction()
            return res.status(500).json({
                message: "[Error]: Server error",
                success: false
            })
        }finally{
            await session.endSession()
        }
    }
)
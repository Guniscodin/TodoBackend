import type { InferSchemaType } from "mongoose"
import User from "../../schemas/user.js"
import Task from "../../schemas/task.js"

export type IUser = InferSchemaType<typeof User>
export type ITask = InferSchemaType<typeof Task>

export interface ResponseBodySuccess<T = object> {
    message: string
    success: boolean
    data: T
}

export interface ResponseBody {
    message: string
    success: boolean
}

export const PRIORITIES = ["high","normal","low"] as const
export type priority = (typeof PRIORITIES)[number];
export interface TaskBody {
    userId: string
    title: string
    content: string
    label : string
    priority : priority
    completed: boolean
}
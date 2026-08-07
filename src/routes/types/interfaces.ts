import type { InferSchemaType } from "mongoose"
import User from "../../schemas/user.js"
import Task from "../../schemas/task.js"
import Session from "../../schemas/session.js"

export type IUser = InferSchemaType<typeof User>
export type ITask = InferSchemaType<typeof Task>
export type ISession = InferSchemaType<typeof Session>

export type SignUpBody = {
    email: string
    user: string
    password: string
}

export interface ResponseBodySuccess<T = object> {
    message: string
    success: boolean
    data: T
}

export interface ResponseBody {
    message: string
    success: boolean
}

export const STATUS = ["active","revoked"] as const
export type status = (typeof STATUS)[number];
export interface SessionBody {
    userId: string
    sessionTokens: string[]
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
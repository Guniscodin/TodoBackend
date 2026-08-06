import type { Types } from "mongoose"

export interface IUser {
    _id: Types.ObjectId
    user: string
    email: string
    password: string
    tasks: number
}

export interface MongooseMeta {
    createdAt: Date
    updatedAt: Date
    __v: number
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
import type { priority } from "../types/interfaces.js";
import type { ResponseBody } from "../types/interfaces.js";

export const checkTaskFields = (
    title: string,
    content: string,
    priority: priority): ResponseBody =>{
        if (
            !title.trim() ||
            !content.trim() ||
            !priority
        ){
            return {
                message: "Title, content, and priority are required.",
                success: false
            }
        }
        if (
            title.length < 3 || title.length > 50
        ){
            return {
                message: `Title must be at least 3
                characters long and less then 50 characters`,
                success: false
            }
        }
        if (content.trim().length > 2000){
            return {
                message: `Task content is too long ,
                must be below 2000 characters!`,
                success: false
            }
        }
        return {
            message: "",
            success: true
        }
}
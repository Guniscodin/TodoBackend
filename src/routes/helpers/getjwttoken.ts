import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

type ofType = "access" | "refresh"

const gettoken = (id: string , type: ofType) =>{
    if(typeof id !== "string" || typeof type !== "string"){
        return {
            success: false,
        }
    }
    if (!id.trim() || !type.trim()){
        return {
            success: false
        }
    }
    if (type === "access"){
        const secret = process.env.JWT_SECRET
        if (!secret){
        return {
            success: false
        }
        }
        const token: string = jwt.sign({
            id: id.trim(),
            type: "access"
        },secret,{
            algorithm: "HS256",
            expiresIn: "15m"
        })
        return {
            token: token,
            success: true
        }
    }
    if (type === "refresh"){
        const secret = process.env.JWT_REFRESH_SECRET
        if (!secret){
        return {
            success: false
        }
        }
        const token: string = jwt.sign({
            id: id.trim(),
            type: "refresh"
        },secret,{
            algorithm: "HS256",
            expiresIn: "7d"
        })
        return {
            token: token,
            success: true
        }
    }
    return {
        message: "Invalid token type!",
        success: false
    }
}

export default gettoken
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const connectDb = async (): Promise<void> =>{
    console.log("Connecting to database...\n")
    try{
        const URI: string | undefined = process.env.MONGO_URI
        if (!URI){
            throw new Error("Mongo URI not found!")
        }
        await mongoose.connect(URI)
    }catch(err){
        console.error(err)
        process.exit(1)
    }
}

export default connectDb
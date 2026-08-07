import mongoose from "mongoose";
import { STATUS } from "../routes/types/interfaces.js";
import type { SessionBody } from "../routes/types/interfaces.js";

const tokenSchema = new mongoose.Schema({
    tokenHashed: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: STATUS
    }
},{
    timestamps: true
})

const sessionSchema = new mongoose.Schema<SessionBody>({
    userId: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
    },
    sessionTokens: [tokenSchema]
},{
    timestamps: true
})

export default mongoose.model("Sessions", sessionSchema)
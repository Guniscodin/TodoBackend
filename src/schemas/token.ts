import mongoose from "mongoose"
import { STATUS } from "../routes/types/interfaces.js";

const refreshTokenSchema = new mongoose.Schema(
    {
        sessionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Sessions",
            required: true,
            index: true
        },
        tokenHash: {
            type: String,
            required: true,
            unique: true
        },
        status: {
            type: String,
            enum: STATUS,
            default: "active",
            required: true
        },
        replacedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "RefreshToken",
            default: null
        },
        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

refreshTokenSchema.index({
    expiresAt: 1
}, { expireAfterSeconds: 0})

export default mongoose.model("Tokens", refreshTokenSchema)
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
            index: true
        },
        userAgent: {
            type: String
        },
        lastUsedAt: {
            type: Date,
            default: Date.now
        },
        expiresAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true
    }
);

sessionSchema.index({
    expiresAt: 1
},{expireAfterSeconds: 0})

export default mongoose.model("Sessions", sessionSchema);
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    user: {
        type: String,
        unique: true,
        min: 3,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 8
    },
    totalTasks: {
        type: Number,
        default: 0,
        max: 100,
        min: 0
    }
},{
    timestamps: true
})

export default mongoose.model("Users",userSchema)
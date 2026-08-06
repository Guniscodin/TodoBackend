import mongoose from "mongoose"
import type { TaskBody } from "../routes/types/interfaces.js"
import { PRIORITIES } from "../routes/types/interfaces.js"

const taskSchema = new mongoose.Schema<TaskBody>({
    userId: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 50,
        minlength: 3,
        trim: true
    },
    label: {
        type: String,
        maxlength: 20,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    priority: {
        type: String,
        enum: PRIORITIES,
        default: PRIORITIES[1],
    },
    completed: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

export default mongoose.model("Tasks",taskSchema)
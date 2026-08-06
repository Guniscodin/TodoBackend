// initial setup...
import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import connectDb from "./database.js"

const app = express()
app.use(cors())
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())

// routes import
import { signInRouter } from "./routes/auth/signup.js"
import { logInRouter } from "./routes/auth/login.js"
import { deleteRouter } from "./routes/crudroutes/deletetask.js"
import { addtaskRouter } from "./routes/crudroutes/addtask.js"
import { getRouter } from "./routes/crudroutes/gettasks.js"
import { updateRouter } from "./routes/crudroutes/updatetask.js"
import { rateLimiter } from "./middlewares/ratelimiter.js"

// custom middleware
app.use(rateLimiter(100,15))

// run routes
app.use("/api/v1/auth",signInRouter)
app.use("/api/v1/auth",logInRouter)
app.use("/api/v1/task",deleteRouter)
app.use("/api/v1/task",addtaskRouter)
app.use("/api/v1/task",getRouter)
app.use("/api/v1/task",updateRouter)

// run server
const port: number = Number(process.env.PORT) || 4000
connectDb().then(()=>{
    app.listen(port, ()=>{
        console.log(`Server running on ${port}`)
    })
})
import express from "express";
import { UserController } from "./controllers/UserController"
import { UserService } from "./services/UserService"
import AppDataSource from "./db/DataSource";

const app = express()
app.use(express.json())

const init = async () => {
    try {
        await AppDataSource.initialize()
        console.log("Database connected successfully")
    } catch (error) {
        console.error("Error connecting to the database:", error)
        process.exit(1)
    }

    const userService = new UserService(AppDataSource)
    const userController = new UserController(userService)

    app.use("/api/v1", userController.registerRoutes())
    app.use("/health", (_req, res) => {
        res.status(200).json({ status: "OK" })
    })

    const PORT = process.env['PORT'] || 8080
    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })

    const gracefulShutdown = () => {
        console.log("Shutting down server...")
        server.close(() => {
            console.log("Server closed")
            AppDataSource.destroy().then(() => {
                console.log("Database connection closed")
                process.exit(0)
            }).catch((error) => {
                console.error("Error closing database connection:", error)
                process.exit(1)
            })
        })
    }

    process.on("SIGINT", gracefulShutdown)
    process.on("SIGTERM", gracefulShutdown)
}

init()
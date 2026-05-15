
import { User } from "../models/User";
import { UserService } from "../services/UserService";
import type { Request, Response } from "express"
import { Router } from "express";

export class UserController {
    private readonly userService: UserService
    constructor(userService: UserService) {
        this.userService = userService
    }

    async createUser(req: Request, res: Response) {
        const userData = req.body as User
        try {
            const newUser = await this.userService.createUser(userData)
            res.status(201).json(newUser)
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    async updateUser(req: Request, res: Response) {
        const userId = req.params['id'] as string
        const updates = req.body as Partial<User>
        try {
            const updatedUser = await this.userService.updateUser(userId, updates)
            if (updatedUser) {
                res.json(updatedUser)
            } else {
                res.status(404).json({ error: "User not found" })
            }
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    async getUser(req: Request, res: Response) {
        const userId = req.params['id'] as string
        const email = req.query['email'] as string | undefined
        try {
            const user = await this.userService.getUserByEmailOrId(email, userId)
            if (user) {
                res.json(user)
            } else {
                res.status(404).json({ error: "User not found" })
            }
        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    registerRoutes(): Router {
        const router = Router()
        router.post("/", this.createUser.bind(this))
        router.put("/:id", this.updateUser.bind(this))
        router.get("/:id", this.getUser.bind(this))
        router.use("/users", router)
        return router
    }
}
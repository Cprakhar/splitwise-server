import type { DataSource, Repository } from "typeorm"
import { User } from "../models/User"
import { hash } from "bcryptjs"

export class UserService {
    private readonly dataSource: DataSource
    private readonly userRepository: Repository<User>
    constructor(dataSource: DataSource) {
        this.dataSource = dataSource
        this.userRepository = this.dataSource.getRepository(User)
    }

    async createUser(user: User) {
        user.passwordHash = await this.hashPassword(user.passwordHash)
        const newUser = this.userRepository.create(user)
        const savedUser: Partial<User> = await this.userRepository.save(newUser)
        delete savedUser.passwordHash
        return savedUser
    }

    async getUserByEmailOrId(email?: string, id?: string) {
        const user: Partial<User> | null = await this.userRepository.findOneBy({ email, id })
        if (user) {
            delete user.passwordHash
        }
        return user
    }
    
    async updateUser(id: string, updates: Partial<User>) {
        if (updates.passwordHash) {
            updates.passwordHash = await this.hashPassword(updates.passwordHash)
        }
        await this.userRepository.update(id, updates)
        const updatedUser: Partial<User> | null = await this.userRepository.findOneBy({ id })
        if (updatedUser) {
            delete updatedUser.passwordHash
        }
        return updatedUser
    }

    private async hashPassword(password: string): Promise<string> {
        return hash(password, 10)
    }
}
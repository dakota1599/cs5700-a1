import fs from 'fs'
import jwt from 'jsonwebtoken'
import { compare, hash } from '../util/hashing.js'
import { constructPath } from '../util/functions.js'
import { DB, PRIVATE_KEY, USERS } from '../env.js'
import { User } from '../models/user.js'
import { ActionResult, ServerError } from '../models/action-result.js'

const userPath = constructPath(DB, USERS)

export class UserRepo {
    static async register(
        name: string,
        username: string,
        pass: string
    ): Promise<ActionResult<User>> {
        if (UserRepo.findUser(username))
            return new ActionResult<User>(void 0, {
                status: 409,
                message: 'This username is already taken.  Please try another.',
            } as ServerError)
        const hashedPass = await hash(pass)

        const user = UserRepo.generateUser(name, username, hashedPass)

        UserRepo.writeUser(user)

        return new ActionResult<User>(user)
    }

    static async createSecurityQuestion(
        username: string,
        question: string,
        answer: string
    ): Promise<ActionResult<string>> {
        if (question.length < 5 || answer.length < 3)
            return new ActionResult<string>(void 0, {
                status: 400,
                message:
                    'Security question must be at least five characters long and security answer must be at lest three characters long',
            })

        const user = UserRepo.findUser(username)
        if (!user)
            return new ActionResult<string>(void 0, {
                status: 404,
                message: 'User could not be found in system.',
            })

        user.securityQuestion = {
            question,
            answer,
        }

        UserRepo.writeUser(user)

        return new ActionResult<string>('Security question and answer saved!')
    }

    static generateUser(name: string, username: string, hash: string) {
        return {
            name,
            username,
            hash,
            permissions: [],
            failedLogins: 0,
        } as User
    }

    static async login(
        username: string,
        pass: string
    ): Promise<ActionResult<string>> {
        const user = UserRepo.findUser(username)
        if (!user)
            return new ActionResult<string>(void 0, {
                status: 404,
                message: `User with username: ${username} not in system.`,
            } as ServerError)

        if (user.failedLogins >= 3)
            return new ActionResult<string>(void 0, {
                status: 403,
                message:
                    'You have exceeded you three login attempt threshhold.  Please contact your system admin.',
            } as ServerError)

        const auth = await compare(pass, user.hash)

        if (!auth) {
            user.failedLogins++
            UserRepo.writeUser(user)
            return new ActionResult<string>(void 0, {
                status: 401,
                message: 'Username or password is incorrect.',
            } as ServerError)
        }

        const token = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
                data: { user: user.username, name: user.name },
            },
            PRIVATE_KEY
        )
        return new ActionResult<string>(token)
    }

    static getUserFileName = (username: string) => `${userPath}/${username}.txt`

    static findUser(username: string) {
        const path = UserRepo.getUserFileName(username)
        if (!fs.existsSync(path)) return null
        const data = fs.readFileSync(path)

        if (data == void 0) return null

        const user = JSON.parse(data.toString()) as User
        return user
    }

    static writeUser(user: User) {
        const path = UserRepo.getUserFileName(user.username)
        fs.writeFileSync(path, JSON.stringify(user))
    }
}

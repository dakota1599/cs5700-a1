import fs from 'fs'
import jwt from 'jsonwebtoken'
import { compare, hash } from '../util/hashing.js'
import { constructPath } from '../util/functions.js'
import { DB, PRIVATE_KEY, USERS } from '../env.js'
import { SecurityQuestion, User } from '../models/user.js'
import { ActionResult, ServerError } from '../models/action-result.js'

const userPath = constructPath(DB, USERS)

export class UserRepo {
    /**
     * @param name
     * @param username
     * @param pass
     * @returns ActionResult<User>
     * Registers the user in the system.  If the user exists already, an error is returned within the ActionResult.
     * Otherwise the newly created user information is passed back to the caller.
     */
    static async register(
        name: string,
        username: string,
        pass: string,
        securityQuestion: string,
        securityAnswer: string
    ): Promise<ActionResult<User>> {
        if (UserRepo.findUser(username))
            return new ActionResult<User>(void 0, {
                status: 409,
                message: 'This username is already taken.  Please try another.',
            } as ServerError)
        const hashedPass = await hash(pass)
        const hashedSecurityAnswer = await hash(securityAnswer)

        const user = UserRepo.generateUser(
            name,
            username,
            hashedPass,
            securityQuestion,
            hashedSecurityAnswer
        )

        UserRepo.writeUser(user)

        return new ActionResult<User>(user)
    }

    /**
     * @param username
     * @param question
     * @param answer
     * @returns ActionResult<string>
     * Creates the security question for the user.  Generally this will be called after user
     * registration of when the user wishes to change their security question.
     */
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

    /**
     *
     * @param name
     * @param username
     * @param hash
     * @returns User
     * A method for easy creation of the user object.
     */
    static generateUser(
        name: string,
        username: string,
        hash: string,
        securityQuestion: string,
        securityAnswer: string
    ) {
        const sec = {
            question: securityQuestion,
            answer: securityAnswer,
        } as SecurityQuestion
        return {
            name,
            username,
            hash,
            permissions: [],
            securityQuestion: sec,
            failedLogins: 0,
        } as User
    }

    /**
     *
     * @param username
     * @param pass
     * @returns ActionResult<string>
     * Authorizes the user if they have the proper credentials for a user within the
     * system.  An error is passed in the ActionResult if the provided credentials are
     * invalid.  Otherwise a JSON Web Token is returned.
     */
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

    /**
     * @param username
     * @returns string
     * A simple method for creating the path to the desired user record.
     */
    static getUserFileName = (username: string) => `${userPath}/${username}.txt`

    /**
     * @param username
     * @returns User | null
     * Finds the user within the 'database' if the user exists.  The user object is returned
     * if it is found, otherwise null is returned.
     */
    static findUser(username: string) {
        const path = UserRepo.getUserFileName(username)
        if (!fs.existsSync(path)) return null
        const data = fs.readFileSync(path)

        if (data == void 0) return null

        const user = JSON.parse(data.toString()) as User
        return user
    }

    /**
     * @param user
     * Overwrites the user to their respective record.  Generally this is done when
     * user data is altered and needs to be updated in the record.
     */
    static writeUser(user: User) {
        const path = UserRepo.getUserFileName(user.username)
        fs.writeFileSync(path, JSON.stringify(user))
    }

    static getAllUsers() {
        const users = [] as any[]

        fs.readdirSync(userPath).forEach((u) => {
            const user = this.findUser(u.split('.')[0])
            if (user)
                users.push({
                    name: user.name,
                    username: user.username,
                })
        })

        return users
    }
}

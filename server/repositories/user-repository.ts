import fs from 'fs'
import jwt from 'jsonwebtoken'
import { compare, hash } from '../util/hashing.js'
import { constructPath } from '../util/functions.js'
import { DB, PRIVATE_KEY, USERS } from '../env.js'
import { User } from '../models/user.js'

const userPath = constructPath(DB, USERS)

console.log(userPath)
export class UserRepo {
    static async register(name: string, user: string, pass: string) {
        if (UserRepo.getUser(user)) return false

        const hashedPass = await hash(pass)
        let result = true

        await fs.appendFile(
            userPath,
            `${name},${user},${hashedPass}\n`,
            (err) => (result = false)
        )

        return result
    }

    static async login(username: string, pass: string) {
        const user = UserRepo.getUser(username)
        if (!user) throw new Error('User not in system.')

        const auth = await compare(pass, user.hash)

        if (!auth) throw new Error('Username or password is incorrect.')

        const token = jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60,
                data: { user: user.username, name: user.name },
            },
            PRIVATE_KEY
        )

        return token
    }

    static getUser(user: string) {
        const users = UserRepo.parseUsers()

        return users.find((u) => u.username == user)
    }

    static parseUsers() {
        const users: User[] = []
        const data = fs.readFileSync(userPath)

        if (data == void 0) return users
        const lines = data.toString().split('\n')

        lines.forEach((l, i) => {
            if (i == 0) return
            const pieces = l.split(',')
            if (
                pieces[0] == void 0 ||
                pieces[1] == void 0 ||
                pieces[2] == void 0
            )
                return
            users.push({
                name: pieces[0],
                username: pieces[1],
                hash: pieces[2],
            } as User)
        })
        return users
    }

    static createCsv() {
        if (fs.existsSync(userPath)) return
        fs.writeFileSync(userPath, 'name,user,pass\n')
    }
}

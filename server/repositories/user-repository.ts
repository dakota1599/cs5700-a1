import fs from 'fs'
import { hash } from '../util'

export class UserRepo {
    static readonly FILE = './data/users.csv'

    static async register(name: string, user: string, pass: string) {
        const hashedPass = await hash(pass)
        let result = true
        UserRepo.validate()

        await fs.appendFile(
            UserRepo.FILE,
            `${name},${user},${hashedPass}\n`,
            (err) => (result = false)
        )

        return result
    }

    static validate() {
        if (fs.existsSync(UserRepo.FILE)) return
        fs.writeFileSync(UserRepo.FILE, 'name,user,pass\n')
    }
}

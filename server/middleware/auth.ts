import jwt, { JwtPayload } from 'jsonwebtoken'
import { PRIVATE_KEY } from '../env.js'
import { UserRepo } from '../repositories/user-repository.js'

export const checkPerm = (...perms: string[]) => {
    return (req: any, res: any, next: any) => {
        const auth = req.headers.authorization
        if (auth == '' || auth == void 0)
            return res.status(401).send('Access Denined.')

        const token = auth.split(' ')
        if (token.length < 2) return res.status(401).send('Access Denied.')

        try {
            var decoded = jwt.verify(token[1], PRIVATE_KEY) as JwtPayload
            console.log(decoded)
            if (UserRepo.findUser(decoded.data.user)) next()
            else return res.status(401).send('Access Denied.')
        } catch (err) {
            return res
                .status(500)
                .send('Server error when attempting to authorize.')
        }
    }
}

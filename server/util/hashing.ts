import bcrypt from 'bcrypt'

export async function hash(password: string, saltRound: number = 10) {
    return await bcrypt.hash(password, saltRound)
}

export async function compare(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
}

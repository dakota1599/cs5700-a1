import bcrypt from 'bcrypt'

/**
 * @param password
 * @param saltRound
 * @returns string
 * Takes in a password and a salt round for hashing.
 */
export async function hash(password: string, saltRound: number = 10) {
    return await bcrypt.hash(password, saltRound)
}

/**
 * @param password
 * @param hash
 * @returns boolean
 * Compares the inputted password with the inputted hash and determines if the hash belongs
 * to the password.
 */
export async function compare(password: string, hash: string) {
    return await bcrypt.compare(password, hash)
}

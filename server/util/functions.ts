import fs from 'fs'
import { DB, USERS } from '../env.js'

/**
 * Creates the parent database directory.
 */
function _createDatabase() {
    _constructDirectory(constructPath(DB))
}

/**
 * @param dir
 * Constructs a directory using NodeJS' file system.
 */
function _constructDirectory(dir: string) {
    try {
        if (fs.existsSync(dir)) return
        fs.mkdirSync(dir)
    } catch (err) {
        console.error(err)
    }
}

/**
 * Creates all the directories needed for our 'database'.
 */
export function createDirectory() {
    _createDatabase()
    const paths = [USERS]

    paths.forEach((p) => {
        _constructDirectory(constructPath(DB, p))
    })
}

/**
 * @param slugs
 * @returns string
 * Constructs a path using the inputted slugs in the order they were inputted.
 */
export function constructPath(...slugs: string[]) {
    return `./${slugs.join('/')}`
}

/**
 * @param pass
 * @returns boolean
 * Performs regex check on password to make sure it matches our password specifications.
 */
export function isValidPassword(pass: string) {
    const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,}$/
    return regex.test(pass)
}

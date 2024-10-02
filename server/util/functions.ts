import fs from 'fs'
import { DB, USERS } from '../env.js'

function _createDatabase() {
    _constructDirectory(constructPath(DB))
}

function _constructDirectory(dir: string) {
    try {
        if (fs.existsSync(dir)) return
        fs.mkdirSync(dir)
    } catch (err) {
        console.error(err)
    }
}

export function createDirectory() {
    _createDatabase()
    const paths = [USERS]

    paths.forEach((p) => {
        _constructDirectory(constructPath(DB, p))
    })
}

export function constructPath(...slugs: string[]) {
    return `./${slugs.join('/')}`
}

export function isValidPassword(pass: string) {
    const regex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,}$/
    return regex.test(pass)
}

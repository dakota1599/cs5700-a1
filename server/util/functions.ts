import fs from 'fs'
import { DB } from '../env.js'

export function createDirectory() {
    const path = constructPath(DB)
    try {
        if (fs.existsSync(path)) return
        fs.mkdirSync(path)
    } catch (err) {
        console.error(err)
    }
}

export function constructPath(...slugs: string[]) {
    return `./${slugs.join('/')}`
}

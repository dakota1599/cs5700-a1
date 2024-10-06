import { Http } from './http'

/**
 * @param token
 * For saving the session token.
 */
export function saveSession(token: string) {
    sessionStorage.setItem('token', token)
}

/**
 * @returns string | null
 * For getting the session token.
 */
export function getSession() {
    return sessionStorage.getItem('token')
}

/**
 * Clears the session token.
 */
export function clearSession() {
    sessionStorage.removeItem('token')
}

/**
 * @returns boolean
 * Checks to see if the session is active by validating the session token.
 */
export async function isActiveSession() {
    const token = getSession()
    if (token == null) return false

    const res = await Http.authorize(token)

    if (res.status == 401) return false

    return true
}

import { SignInDTO, SignUpDTO } from '../types'
import { getSession } from './session'

const base = import.meta.env.VITE_API_ENDPOINT
export class Http {
    /**
     * @param ep
     * @returns string
     * Gets the formated api endpoint.
     */
    static endpoint(ep: string) {
        return base + ep
    }

    /**
     * @param user
     * @returns Promise<Response>
     * Register a new user with the server.
     */
    static async register(user: SignUpDTO) {
        return await fetch(Http.endpoint('register'), {
            method: 'POST',
            body: JSON.stringify({ ...user }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        })
    }

    /**
     * @param user
     * @returns Promise<Response>
     * Log the user into the system and retrieving a jwt.
     */
    static async login(user: SignInDTO) {
        return await fetch(Http.endpoint('login'), {
            method: 'POST',
            body: JSON.stringify({ ...user }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
        })
    }

    /**
     *
     * @returns Promise<Response>
     * Sends a request to the server to get all users in the system.
     */
    static async getAllUsers() {
        const token = Http.token()
        return await fetch(Http.endpoint('users'), {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    }

    /**
     * @param token
     * @returns Promise<Response>
     * Authorize the user with the server.
     */
    static async authorize(token: string = Http.token()) {
        return await fetch(Http.endpoint('authorize'), {
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${token}`,
            },
        })
    }

    /**
     * @returns string
     * Get the current session token.
     */
    static token() {
        return getSession() ?? ''
    }
}

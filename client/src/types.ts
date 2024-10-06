/**
 * Basic user information
 */
export type BasicUserInfo = {
    name: string
    username: string
}

/**
 * The Data Transfer Object for signing up with the server.
 */
export type SignUpDTO = BasicUserInfo & {
    password: string
    password2: string
    securityQuestion: string
    securityAnswer: string
}

/**
 * The Data Transfer Object for signing in to the server.
 */
export type SignInDTO = {
    username: string
    password: string
}

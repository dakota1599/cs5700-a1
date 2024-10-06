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

/**
 * The props used for both the Sign In and the Sign Up components.
 */
export type SignProp = {
    toggleNewUser: (val: number) => void
    onEnter: (info: SignInDTO | SignUpDTO) => void
}

/**
 * The Data Transfer Object for resetting the user's password.
 */
export type ResetPasswordDTO = {
    answer: string
    password: string
    password2: string
}

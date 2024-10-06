/**
 * User Representation (Entity to model what is stored in the Database)
 */
export type User = {
    name: string
    username: string
    hash: string
    permissions: string[]
    failedLogins: number
    securityQuestion?: SecurityQuestion
}

/**
 * Security Question
 */
export type SecurityQuestion = {
    question: string
    answer: string
}

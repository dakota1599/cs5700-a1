/**
 * User representation
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

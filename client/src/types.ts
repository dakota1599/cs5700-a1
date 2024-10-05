export type BasicUserInfo = { name: string; email: string }

export type SignUpDTO = BasicUserInfo & {
    password: string
    password2: string
    securityQuestion: string
    securityAnswer: string
}

export type SignInDTO = {
    email: string
    password: string
}

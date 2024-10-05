export function saveSession(token: string) {
    sessionStorage.setItem('token', token)
}

export function getSession() {
    return sessionStorage.getItem('token')
}

export function isActiveSession() {
    return !!getSession()
}

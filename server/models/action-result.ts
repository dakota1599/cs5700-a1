export type ServerError = {
    status: number
    message: string
}

export class ActionResult<T> {
    error?: ServerError
    data?: T

    constructor(data?: T, error?: ServerError) {
        this.data = data
        this.error = error
    }
}

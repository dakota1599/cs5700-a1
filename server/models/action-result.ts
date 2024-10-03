/**
 * Simple error representation.
 */
export type ServerError = {
    status: number
    message: string
}

/**
 * A result object used to manage the flow of data and errors in our business logic.
 */
export class ActionResult<T> {
    error?: ServerError
    data?: T

    constructor(data?: T, error?: ServerError) {
        this.data = data
        this.error = error
    }
}

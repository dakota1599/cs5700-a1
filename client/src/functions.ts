/**
 * @param errors
 * @returns string
 * Parses the error object created by the react-form-hook library.
 */
export function parseErrors(errors: any) {
    let res = ''
    for (var key in errors) {
        if (key == 'username') res += 'Please provide a valid email address.'
        if (key == 'password' || key == 'password2')
            res +=
                'Please provide a password that is at least 8 characters long, contain special characters, at least one upper and lowercase letter, and a number.'
        if (key == 'name')
            res += 'Please provide a name that is at least 2 characters long.'
        if (key == 'securityQuestion')
            res +=
                'Please provide a secuirty question that is at least 5 characters long.'
        if (key == 'securityAnswer')
            res +=
                'Please provide a security answer that is at least 3 characters long.'

        res += '\n'
    }
    return res
}

import express from 'express'
import cors from 'cors'
import { UserRepo } from './repositories/user-repository.js'
import {
    createDirectory,
    isValidPassword,
    parseToken,
} from './util/functions.js'
import { checkPerm } from './middleware/auth.js'

createDirectory()

const app = express()

// Adding middleware
app.use(cors())
app.use(express.json())

/**
 * Endpoint for registering a user into the system.
 */
app.post('/register', (req, res) => {
    const data = req.body
    let error = ''
    if (data == null || data == void 0) {
        res.status(400).send('Must submit a name, username, and password.')
        return
    }
    if (data.name == null) error += 'A name is required.\n'
    if (data.name?.length < 2) error += 'Name must be at 2 characters long.\n'
    if (data.username == null) error += 'A username is required.\n'
    if (data.username?.length < 3)
        error += 'Username must be at least 3 characters long.\n'
    if (data.password == null) error += 'A password is required.\n'
    if (data.securityQuestion == null)
        error += 'A security question is required.\n'
    if (data.securityQuestion?.length < 5)
        error += 'Security Question must be at least 5 characters long.\n'
    if (data.securityAnswer == null) error += 'A security answer is required.\n'
    if (data.securityAnswer?.length < 3)
        error += 'Security Answer must be at least 3 characters long.\n'

    if (!isValidPassword(data.password))
        error +=
            'Password must be at least 8 characters long, contain special characters, at least one upper and lowercase letter, and a number.'

    if (error.length > 0) {
        res.status(400).send({ message: error })
        return
    }

    UserRepo.register(
        data.name,
        data.username,
        data.password,
        data.securityQuestion,
        data.securityAnswer
    )
        .then((result) => {
            if (result.data)
                res.status(201).send({
                    message: `User [${result.data.username}] created.`,
                })
            else if (result.error)
                res.status(result.error.status).send({
                    message: result.error.message,
                })
            else res.status(500).send({ message: 'Unknown user error.' })
        })
        .catch((err) => res.status(500).send({ message: err }))
})

/**
 * Endpoint for logging a user into the system.
 */
app.post('/login', (req, res) => {
    const data = req.body
    let error = ''
    if (data == null)
        return res.status(400).send('Must send a username and password')
    if (data.username == null) error += 'Must send a username.\n'
    if (data.password == null) error += 'Must send a password.\n'

    if (error.length > 0) return res.status(400).send(error)

    try {
        UserRepo.login(data.username, data.password).then((result) => {
            if (result.data) res.status(200).send({ token: result.data })
            else if (result.error)
                res.status(result.error.status).send({
                    message: result.error.message,
                })
            else res.status(500).send({ message: 'Unknown server error.' })
        })
    } catch (err: any) {
        res.status(404).send(err.message)
    }
})

/**
 * Endpoint for resetting the users password.
 */
app.post('/reset', (req, res) => {
    const data = req.body
    let error = ''

    if (data == null || data == void 0) {
        res.status(400).send(
            'Must submit your security answer and new password.'
        )
        return
    }

    if (data.username == null) error += 'Must send a username.\n'
    if (data.answer == null)
        error += 'Must send an answer to the security question.\n'
    if (data.password == null) error += 'Must send a password.\n'

    if (error.length > 0) return res.status(400).send(error)

    UserRepo.resetPassword(data.username, data.answer, data.password).then(
        (result) => {
            if (result.data) res.status(200).send({ message: result.data })
            else if (result.error)
                res.status(result.error.status).send({
                    message: result.error.message,
                })
            else res.status(500).send({ message: 'Unknown server error.' })
        }
    )
})

/**
 * Endpoint for simply checking if the user is currently authorized with the system.
 */
app.get('/authorize', checkPerm(), (req, res) => {
    res.sendStatus(201)
})

app.route('/users').get(checkPerm(), (req, res) => {
    const users = UserRepo.getAllUsers()

    res.status(200).send(users)
})

app.route('/security')
    /**
     * Endpoint for getting the user's security question either by submitting the user's username or using the username stored in the
     * active jwt.
     */
    .get((req, res) => {
        const token = req.query.token as boolean | undefined
        const username = req.query.username as string | undefined
        let data
        if (token != null) {
            const userData = parseToken(req.headers.authorization ?? '')
            if (userData == null)
                return res
                    .status(401)
                    .send({ message: 'Invalid token provided.' })
            data = userData.user
        } else {
            if (username == null)
                return res
                    .status(400)
                    .send({ message: 'Must submit a username' })
            data = username
        }

        UserRepo.getSecurityQuestion(data).then((result) => {
            if (result.data) res.status(200).send({ question: result.data })
            else if (result.error)
                res.status(result.error.status).send({
                    message: result.error.message,
                })
            else res.status(500).send({ message: 'Unknown server error.' })
        })
    })
    /**
     * Endpoint for setting the user's security question.  Must be authorized to change security question.
     */
    .post(checkPerm(), (req, res) => {
        const data = req.body
        if (data == null || data == void 0) {
            res.status(400).send('Must submit a security question and answer')
            return
        }
        let errors = ''
        if (data.question == null)
            errors += 'A security question is required.\n'
        if (data.answer == null) errors += 'A security answer is required.\n'

        if (errors.length > 0) return res.status(400).send({ message: errors })

        const userData = parseToken(req.headers.authorization ?? '')
        if (userData == null)
            return res
                .status(401)
                .send({ message: 'An error occurred during authentication.' })

        UserRepo.createSecurityQuestion(
            userData.user,
            data.question,
            data.answer
        ).then((result) => {
            if (result.data) res.status(200).send({ question: result.data })
            else if (result.error)
                res.status(result.error.status).send({
                    message: result.error.message,
                })
            else res.status(500).send({ message: 'Unknown server error.' })
        })
    })

/**
 * Endpoint for checking the health of the API.
 */
app.get('/health', (req, res) => {
    return res.status(200).send('API is active.')
})

// Set the port and listen for incoming requests
app.listen(3000, () => {
    console.log('Listening on port 3000')
})

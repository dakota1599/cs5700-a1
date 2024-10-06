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

app.get('/authorize', checkPerm(), (req, res) => {
    res.sendStatus(201)
})

app.route('/users').get(checkPerm(), (req, res) => {
    const users = UserRepo.getAllUsers()

    res.status(200).send(users)
})

app.get('/security', (req, res) => {
    const data = req.query.username as string | undefined
    if (data == null)
        return res.status(400).send({ message: 'Must submit a username' })

    UserRepo.getSecurityQuestion(data).then((result) => {
        if (result.data) res.status(200).send({ question: result.data })
        else if (result.error)
            res.status(result.error.status).send({
                message: result.error.message,
            })
        else res.status(500).send({ message: 'Unknown server error.' })
    })
})

app.get('/health', (req, res) => {
    return res.status(200).send('API is active.')
})

// Set the port and listen for incoming requests
app.listen(3000, () => {
    console.log('Listening on port 3000')
})

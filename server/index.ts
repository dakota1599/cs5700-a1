import express from 'express'
import { UserRepo } from './repositories/user-repository.js'
import { createDirectory, isValidPassword } from './util/functions.js'
import { User } from './models/user.js'
import { checkPerm } from './middleware/auth.js'

createDirectory()

const app = express()

app.use(express.json())

app.post('/register', (req, res) => {
    const data = req.body
    let error = ''
    if (data == null || data == void 0)
        return res
            .status(400)
            .send('Must submit a name, username, and password.')
    if (data.name == null) error += 'A name is required.\n'
    if (data.username == null) error += 'A username is required.\n'
    if (data.password == null) error += 'A password is required.\n'

    if (!isValidPassword(data.password))
        error +=
            'Password must be at least 8 characters long, contain special characters, at least one upper and lowercase letter, and a number.'

    if (error.length > 0) return res.status(400).send(error)

    UserRepo.register(data.name, data.username, data.password)
        .then((result) => {
            if (result.data)
                res.status(201).send(`User [${result.data.username}] created.`)
            else if (result.error)
                res.status(result.error.status).send(result.error.message)
            else res.status(500).send('Unknown user error.')
        })
        .catch((err) => res.status(500).send(err))
})

app.route('/users')
    .get((req, res) => {
        res.status(200).send('Not Implemented')
    })
    .post((req, res) => {
        const data = req.body
        let error = ''
        if (data == null)
            return res.status(400).send('Must send a username and password')
        if (data.username == null) error += 'Must send a username.\n'
        if (data.password == null) error += 'Must send a password.\n'

        if (error.length > 0) return res.status(400).send(error)

        try {
            UserRepo.login(data.username, data.password).then((result) => {
                if (result.data) res.status(200).send(result.data)
                else if (result.error)
                    res.status(result.error.status).send(result.error.message)
                else res.status(500).send('Unknown user error.')
            })
        } catch (err: any) {
            res.status(404).send(err.message)
        }
    })

app.get('/health', (req, res) => {
    return res.status(200).send('API is active.')
})

app.get('/test', checkPerm(), (req, res) => {
    return res.status(200).send('Pass')
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
})

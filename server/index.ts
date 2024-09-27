import express from 'express'
import { UserRepo } from './repositories/user-repository.js'
import { createDirectory } from './util/functions.js'
import { User } from './models/user.js'

createDirectory()
UserRepo.createCsv()

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

    if (error.length > 0) return res.status(400).send(error)

    UserRepo.register(data.name, data.username, data.password)
        .then((result) => {
            if (result) res.status(200).send(`User [${data.name}] created.`)
            else res.status(500).send('Server error.')
        })
        .catch((err) => res.status(500).send(err))
})

app.route('/users')
    .get((req, res) => {
        const users = UserRepo.parseUsers()

        res.status(200).send(users)
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
                res.status(200).send(result)
            })
        } catch (err: any) {
            res.status(404).send(err.message)
        }
    })

app.get('/health', (req, res) => res.status(200).send('API is active.'))

app.listen(3000, () => {
    console.log('Listening on port 3000')
})

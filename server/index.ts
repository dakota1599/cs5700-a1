import express from 'express'

const app = express()

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
})

app.get('/health', (req, res) => res.status(200).send('API is active.'))

app.listen(3000)

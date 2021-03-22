const express = require('express')
const app = express()

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
app.use(morgan('tiny'))

require('./app')(app, '/api');

const port = 3001
app.listen(port, () => {
    console.log(`UDP API. Listening on port ${port}`)
})

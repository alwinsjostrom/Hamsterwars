//Importera paket och konfigurera server
const express = require('express')
const app = express()
const cors = require('cors')
const hamsterRouter = require('./routes/hamsters.js')

const PORT = process.env.PORT || 5500

//Middleware
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/', express.static(__dirname + '/frontend'))

//Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body)
    next()
})

//Routes och endpoints
app.use('/hamsters', hamsterRouter)

//Kör igång servern
app.listen(PORT, () => {
    console.log('Server running on port: ' + PORT);
})
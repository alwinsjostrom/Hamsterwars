//Importera paket och konfigurera server
const express = require('express')
const app = express()
const hamsterRouter = require('./routes/hamsters.js')

const PORT = process.env.PORT || 5500

//Middleware
app.use( express.urlencoded({ extended: true }) )
app.use( express.json() )
app.use( '/', express.static(__dirname + '/frontend') )

//Logger
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, req.body)
    next()
})

//Routes och endpoints
app.use('/', hamsterRouter)

//Kör igång servern
app.listen(PORT, () => {
    console.log('Server running on http://localhost:' + PORT);
})
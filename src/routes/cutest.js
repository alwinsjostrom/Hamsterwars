//Importera paket
const express = require('express')
const router = express.Router()

//const database = require('../database.js')
//const connect = database.connect
//const db = connect()

//const HAMSTERS = 'hamsters'
const getAll = require('./hamsters.js')

//Hämta den hamster med bäst statistik
router.get('/cutest', async (req, res) => {
    let array = await getAll()
    res.send(array)
    array.forEach(hamster => {
        //let stats = hamster.wins
    })
})

module.exports = router
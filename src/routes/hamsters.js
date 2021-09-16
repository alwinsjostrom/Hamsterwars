//Importera paket
const express = require('express')
const router = express.Router()

const database = require('../database.js')
const connect = database.connect
const db = connect()

const HAMSTERS = 'hamsters'
const allowed = ['id', 'name', 'age', 'favFood', 'loves', 'imgName', 'wins', 'defeats', 'games']

//Hämta en array med alla hamsterobjekt
router.get('/hamsters', async (req, res) => {
    let array = await getAll()
    res.send(array).status(200)
})

//Hämta ett slumpat hamsterobjekt
router.get('/hamsters/random', async (req, res) => {
    let randomHamster = await getRandom()
    res.send(randomHamster).status(200)
})

//Hämta ett specifikt hamsterobjekt
router.get('/hamsters/:id', async (req, res) => {
    let maybeHamster = await getOne(req.params.id)

    if (maybeHamster === null) {
        res.sendStatus(404)
        return
    }

    res.send(maybeHamster).status(200)
})

//Lägg till ett nytt hamsterobjekt
router.post('/hamsters/', (req, res) => {
    if (!isUserObj(req.body)) {
        res.status(400).send('Must be a valid user object')
        return
    }

    db.collection(HAMSTERS).add(req.body)
        .then(function (docRef) {
            let obj = {
                id: `${docRef.id}`
            }
            res.send(obj)
        })
})

//Uppdatera ett hamsterobjekt
router.put('/hamsters/:id', async (req, res) => {
    const docRef = db.collection(HAMSTERS).doc(req.params.id)
    const docSnapshot = await docRef.get()

    //Kolla att objektet enbart innehåller existerande fields
    let keys = Object.keys(req.body)
    for (const key of keys) {
        if (!allowed.includes(key)) {
            res.sendStatus(400)
            return
        }
    }

    //Kolla om det angivna id:t existerar
    if (docSnapshot.exists) {
        await docRef.update(req.body)
        res.sendStatus(200)
        return
    }

    res.sendStatus(404)
})

//Ta bort ett hamsterobjekt
router.delete('/hamsters/:id', async (req, res) => {
    const docRef = db.collection(HAMSTERS).doc(req.params.id)
    const docSnapshot = await docRef.get()

    //Kolla om det angivna id:t existerar
    if (docSnapshot.exists) {
        await db.collection(HAMSTERS).doc(req.params.id).delete()
        res.sendStatus(200)
        return
    }

    res.sendStatus(404)
})

//Hämta den hamster med bäst statistik
router.get('/cutest', async (req, res) => {
    let hamsters = await getAll()
    let highestScore = 0
    let winnerId
    for (const hamster of hamsters) {
        let stats = parseInt(hamster.wins) / parseInt(hamster.games)
        if (stats > highestScore) {
            highestScore = stats
            winnerId = hamster.id
        }
    }

    let maybeHamster = await getOne(winnerId)

    if (maybeHamster === null) {
        res.sendStatus(404)
        return
    }

    res.send(maybeHamster)
})

//Kolla att ett objekt är i korrekt format
function isUserObj(maybeObj) {
    if ((typeof maybeObj) !== 'object') {
        return false
    }

    let keys = Object.keys(maybeObj)
    let counter = 0;

    //Kolla att alla fields är med
    for (i = 0; i < allowed.length; i++) {
        if (keys.includes(allowed[i])) {
            counter++
        }
    }

    return counter === 9
}

async function getAll() {

    const hamstersSnapshot = await db.collection(HAMSTERS).get()

    if (hamstersSnapshot.empty) {
        return []
    }

    const array = []

    await hamstersSnapshot.forEach(async docRef => {
        const data = await docRef.data()
        data.id = docRef.id
        array.push(data)
    })

    return array
}

async function getRandom() {
    const array = await getAll()
    const numberOfHamsters = array.length
    const randomNumber = Math.floor(Math.random() * numberOfHamsters)
    return array[randomNumber]
}

async function getOne(id) {
    const docRef = db.collection(HAMSTERS).doc(id)
    const docSnapshot = await docRef.get()
    if (docSnapshot.exists) {
        return await docSnapshot.data()
    } else {
        return null
    }
}

async function updateOne() {

}

module.exports = router
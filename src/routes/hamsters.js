//Importera paket
const express = require('express')
const router = express.Router()

const database = require('../database.js')
const connect = database.connect
const db = connect()

const HAMSTERS = 'hamsters'
const allowed = ['name', 'age', 'favFood', 'loves', 'imgName', 'wins', 'defeats', 'games']

//Hämta en array med alla hamsterobjekt
router.get('/', async (req, res) => {
    let array = await getAll()
    res.send(array).status(200)
})

//Hämta ett slumpat hamsterobjekt
router.get('/random', async (req, res) => {
    let randomHamster = await getRandom()
    res.send(randomHamster).status(200)
})

//Hämta en array med de hamstrar som vunnit flest matcher
router.get('/cutest', async (req, res) => {
    const winnerArray = await getCutest()

    //Vid tom respons
    if (winnerArray === null) {
        res.sendStatus(404)
        return
    }

    res.send(winnerArray).status(200)
})

//Hämta ett specifikt hamsterobjekt
router.get('/:id', async (req, res) => {
    let maybeHamster = await getOne(req.params.id)

    //Vid tom respons
    if (maybeHamster === null) {
        res.sendStatus(404)
        return
    }

    res.send(maybeHamster).status(200)
})

//Lägg till ett nytt hamsterobjekt
router.post('/', (req, res) => {
    //Vid felaktig body
    if (!isHamsterObj(req.body)) {
        res.status(400).send('Must be a valid user object')
        return
    }

    //Lägg till det nya objektet
    db.collection(HAMSTERS).add(req.body)
        .then(function (docRef) {
            let obj = {
                id: `${docRef.id}`
            }
            res.status(200).send(obj)
        })

})

//Uppdatera ett hamsterobjekt
router.put('/:id', async (req, res) => {
    const docRef = db.collection(HAMSTERS).doc(req.params.id)
    const docSnapshot = await docRef.get()
    let keys = Object.keys(req.body)

    //Kolla att man inte skickar in ett tomt objekt som body
    if (keys.length === 0) {
        res.sendStatus(400)
        return
    }

    //Kolla att man skickar in fields som existerar
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

    //Om man skickar in ett felaktigt id
    res.sendStatus(404)
})

//Ta bort ett hamsterobjekt
router.delete('/:id', async (req, res) => {
    const docRef = db.collection(HAMSTERS).doc(req.params.id)
    const docSnapshot = await docRef.get()

    //Kolla om det angivna id:t existerar
    if (docSnapshot.exists) {
        await docRef.delete()
        res.sendStatus(200)
        return
    }

    //Om man skickar in ett felaktigt id
    res.sendStatus(404)
})

//Kolla att ett objekt är i korrekt format
function isHamsterObj(maybeObj) {
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

    //Om alla fields är rätt returneras true
    return counter === 8
}

//Hämta alla hamsterobjekt
async function getAll() {
    const hamstersSnapshot = await db.collection(HAMSTERS).get()
    const array = []

    if (hamstersSnapshot.empty) {
        return []
    }

    //Lägg till alla objekt i en array
    await hamstersSnapshot.forEach(async docRef => {
        const data = await docRef.data()
        data.id = docRef.id
        array.push(data)
    })

    return array
}

//Hämta ett slumpat hamsterobjekt
async function getRandom() {
    const array = await getAll()
    const numberOfHamsters = array.length
    const randomNumber = Math.floor(Math.random() * numberOfHamsters)
    return array[randomNumber]
}

//Hämta ett specifikt hamsterobjekt
async function getOne(id) {
    const docRef = db.collection(HAMSTERS).doc(id)
    const docSnapshot = await docRef.get()

    //Kolla om id:t existerar i min collection
    if (docSnapshot.exists) {
        return await docSnapshot.data()
    } else {
        return null
    }
}

//Hämta den/de som vunnit flest matcher
async function getCutest() {
    let hamsters = await getAll()
    let highestScore = 0
    let winnerArray = []

    //Kolla vilken/vilka hamstrar som är sötast och lägg deras id:n i en array
    for (const hamster of hamsters) {
        let stats = hamster.wins - hamster.defeats
        if (stats > highestScore) {
            highestScore = stats
            winnerArray = []
            winnerArray.push(hamster)
        } else if (stats === highestScore) {
            winnerArray.push(hamster)
        }
    }

    return winnerArray
}

module.exports = router
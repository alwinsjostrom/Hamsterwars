//Importera paket
const connect = require('../database.js')
const db = connect()
const data = require('../assets/data.json')

const HAMSTERS = 'hamsters'

populate()

//Lägg till alla objekt i min collection
async function populate() {
    data.forEach(obj => {
        let newObj = { 
            ...obj
        }
        db.collection(HAMSTERS).add(newObj)
    })
    console.log('Populated')
}
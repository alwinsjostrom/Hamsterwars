//Importera firebase
const admin = require("firebase-admin");

//Konfigurera firebase-nyckeln
let serviceAccount;
if( process.env.FIREBASEKEY ) {
    serviceAccount = JSON.parse(process.env.FIREBASEKEY)
} else {
    serviceAccount = require('./secrets/firebase_key.json')
}

//Anslut till databasen
let connect = () => {

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })

    const db = admin.firestore()

    return db
}

module.exports = { connect }
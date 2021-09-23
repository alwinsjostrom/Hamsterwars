//Importera firebase
const admin = require("firebase-admin");
const serviceAccount = process.env.FIREBASEKEY || require("./secrets/firebase_key.json");

//Anslut till databasen
let connect = () => {

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })

    const db = admin.firestore()

    return db
}

module.exports = { connect }
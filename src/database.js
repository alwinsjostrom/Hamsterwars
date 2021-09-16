const admin = require("firebase-admin");
const serviceAccount = require("./secrets/firebase_key.json");

let connect = () => {

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    })

    const db = admin.firestore()

    return db
}

module.exports = { connect }
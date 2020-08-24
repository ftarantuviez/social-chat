import firebase from 'firebase'

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAP_O6XS9vzaDeSoyCD_7j7Ji2GmfenI5k",
    authDomain: "chat-5360c.firebaseapp.com",
    databaseURL: "https://chat-5360c.firebaseio.com",
    projectId: "chat-5360c",
    storageBucket: "chat-5360c.appspot.com",
    messagingSenderId: "58489462189",
    appId: "1:58489462189:web:dbda40aced310ff47f1524",
    measurementId: "G-5QMDWPM43F"
})

const db = firebaseApp.firestore()
const auth = firebaseApp.auth()
const storage = firebaseApp.storage()


export {db, auth, storage}
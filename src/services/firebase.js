import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyAs4MCcDbkAXKuZkiurgK24pds8sLKR9Xs",
    authDomain: "orcamento-d3bfd.firebaseapp.com",
    projectId: "orcamento-d3bfd",
    storageBucket: "orcamento-d3bfd.appspot.com",
    messagingSenderId: "309311519181",
    appId: "1:309311519181:web:59b3b36d154298ece72c84",
    measurementId: "G-J9ECWYDMLP"
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

export { db, app, auth }
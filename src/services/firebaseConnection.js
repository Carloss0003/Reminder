import firebase from "firebase";
import 'firebase/database'
import 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAe-FaIHL1vy5R2O_UQOuLjhpsK2pvlhTY",
    authDomain: "react-native-d017f.firebaseapp.com",
    databaseURL: "https://react-native-d017f-default-rtdb.firebaseio.com",
    projectId: "react-native-d017f",
    storageBucket: "react-native-d017f.appspot.com",
    messagingSenderId: "522172270634",
    appId: "1:522172270634:web:c405205b5e99d44a291b53",
    measurementId: "G-8S6NEJQ7QC"
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

export default firebase
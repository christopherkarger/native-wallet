import firebase from "firebase";

export type firebaseDB = firebase.database.Reference;

firebase.initializeApp({
  apiKey: "AIzaSyCpn1RAXi6VWQvGUNrk5dpl_KUANGpw-2M",
  authDomain: "crypto-wallet-98f66.firebaseapp.com",
  databaseURL:
    "https://crypto-wallet-98f66-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "crypto-wallet-98f66",
  storageBucket: "crypto-wallet-98f66.appspot.com",
  messagingSenderId: "423385014326",
  appId: "1:423385014326:web:511e78569e566945517897",
});

export default firebase;
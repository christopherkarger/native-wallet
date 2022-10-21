import firebase from "firebase";
import { FIREBASE_CONFIG } from "../secrets";

export type firebaseDB = firebase.database.Reference;

const fire = firebase.initializeApp(FIREBASE_CONFIG);

export default fire;

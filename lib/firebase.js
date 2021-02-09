import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyAHfjPMImEKcoiSodcwQF9ByH8Js7QweZg",
  authDomain: "nextfire-app-deb30.firebaseapp.com",
  projectId: "nextfire-app-deb30",
  storageBucket: "nextfire-app-deb30.appspot.com",
  messagingSenderId: "997017008784",
  appId: "1:997017008784:web:02eebdbfac006c4fe57615",
  measurementId: "G-RYNS53KRZP",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = fireb.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

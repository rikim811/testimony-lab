// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAT-8LnUDjSG1DOUQ6kv6STFd2c2EL5OeQ",
  authDomain: "testimony-land.firebaseapp.com",
  projectId: "testimony-land",
  storageBucket: "testimony-land.appspot.com",
  messagingSenderId: "1025749506188",
  appId: "1:1025749506188:web:3f2c1ff0731480097503a9",
  measurementId: "G-QSLJLYWCHK"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

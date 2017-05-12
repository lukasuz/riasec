// Initialize Firebase
const currentDate = new Date();
var config = {
  apiKey: "AIzaSyCSl3Y5Ku_fdhlj3DYKKxTV7id7vT9bT7g",
  authDomain: "riasec-7b813.firebaseapp.com",
  databaseURL: "https://riasec-7b813.firebaseio.com",
  projectId: "riasec-7b813",
  storageBucket: "riasec-7b813.appspot.com",
  messagingSenderId: "850293272358"
};
firebase.initializeApp(config);
database = firebase.database();
var dateRef = database.ref(currentDate.toDateString());

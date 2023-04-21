const firebase = require('firebase');


const firebaseConfig = {
    apiKey: "AIzaSyBxgNSNDfyDJjV0_191xAyzoVJDgZ61zUc",
    authDomain: "blog-6715e.firebaseapp.com",
    projectId: "blog-6715e",
    storageBucket: "blog-6715e.appspot.com",
    messagingSenderId: "358367370038",
    appId: "1:358367370038:web:49bf1927aaa10a1f827197",
    measurementId: "G-DVT8XZRMKE"
  };

  firebase.initializeApp(firebaseConfig);

  module.exports = firebase
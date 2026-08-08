// 1. Firebase Config - আপনার নিজের কোড
const firebaseConfig = {
  apiKey: "AIzaSyBdbroawwWdIX6CgQJFFv4Kk3oXAgnc_ak",
  authDomain: "smart-dokan-khata.firebaseapp.com",
  projectId: "smart-dokan-khata",
  storageBucket: "smart-dokan-khata.firebasestorage.app",
  messagingSenderId: "941938264732",
  appId: "1:941938264732:web:6f1ddb88c0d8df480dfb59"
};

// 2. Firebase চালু করা
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// 3. Login
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = e.target.email.value;
  const password = e.target.password.value;
  auth.signInWithEmailAndPassword(email, password)
    .catch(err => alert("Login Error: " + err.message));
});

// 4. Logout
document.getElementById('logout').addEventListener('click', () => auth.signOut());

// 5. Login চেক
auth.onAuthStateChanged(user => {
  if(user){
    // Login হলে
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-screen').style.display = 'block';
    loadData(user.uid);
  } else {
    // Logout হলে
    document.getElementById('login-screen').style.display = 'block';
    document.getElementById('app-screen').style.display = 'none';
  }
});

// 6. Data Load করা
function loadData(uid){
  db.collection('users').doc(uid).get().then(doc => {
    if(doc.exists){
      console.log("Data loaded", doc.data());
      // এখানে আপনার খাতা, বাকি লিস্ট দেখাবেন
    } else {
      console.log("নতুন ইউজার, ডাটা নাই");
    }
  });
}

// 7. Data Save করার ফাংশন
function saveData(uid, data){
  db.collection('users').doc(uid).set(data);
}
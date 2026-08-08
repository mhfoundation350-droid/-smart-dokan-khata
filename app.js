// Firebase আগেই index.html এ চালু করা আছে
const auth = firebase.auth();
const db = firebase.firestore();
let confirmationResult;

// 1. reCAPTCHA চালু করা - OTP এর জন্য লাগবে
window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
  'size': 'invisible',
  'callback': () => {}
});

// 2. OTP পাঠানো
document.getElementById('send-otp').addEventListener('click', () => {
  const phoneNumber = "+88" + document.getElementById('phone-number').value;
  auth.signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
    .then((result) => {
      confirmationResult = result;
      alert("OTP পাঠানো হয়েছে");
    }).catch((error) => {
      alert("Error: " + error.message);
    });
});

// 3. OTP Verify করে Login
document.getElementById('verify-otp').addEventListener('click', () => {
  const code = document.getElementById('otp-code').value;
  confirmationResult.confirm(code).then((result) => {
    const user = result.user;
    console.log("Login Success", user.uid);
  }).catch((error) => {
    alert("ভুল OTP: " + error.message);
  });
});

// 4. Logout
document.getElementById('logout').addEventListener('click', () => auth.signOut());

// 5. Login অবস্থা চেক - আপনার HTML এর ID দিয়ে
auth.onAuthStateChanged(user => {
  if(user){
    // Login হলে
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('app-page').style.display = 'block';
    loadData(user.uid);
  } else {
    // Logout হলে
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('app-page').style.display = 'none';
  }
});

// 6. Data Load করা
function loadData(uid){
  db.collection('customers').where("uid", "==", uid).onSnapshot(snapshot => {
    const list = document.getElementById('customer-list');
    list.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      list.innerHTML += `<li>${data.name} - ${data.amount} টাকা</li>`;
    });
  });
}

// 7. নতুন ক্রেতা Add করা
document.getElementById('add-customer').addEventListener('click', () => {
  const user = auth.currentUser;
  const name = document.getElementById('customer-name').value;
  const amount = document.getElementById('customer-amount').value;
  
  db.collection('customers').add({
    uid: user.uid,
    name: name,
    amount: Number(amount),
    date: new Date()
  });
  document.getElementById('customer-name').value = "";
  document.getElementById('customer-amount').value = "";
});
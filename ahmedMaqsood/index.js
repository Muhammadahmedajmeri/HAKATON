// Firebase configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Switching between Signup and Login forms
document.getElementById('goToSignup').addEventListener('click', function() {
  document.getElementById('login').style.display = 'none';
  document.getElementById('signup').style.display = 'block';
});

document.getElementById('goToLogin').addEventListener('click', function() {
  document.getElementById('signup').style.display = 'none';
  document.getElementById('login').style.display = 'block';
});

// Handle Signup
document.getElementById('signupForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const firstName = document.getElementById('signupFirstName').value;
  const lastName = document.getElementById('signupLastName').value;
  const cnic = document.getElementById('signupCnic').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user data in Firestore
    await setDoc(doc(db, 'students', user.uid), {
      firstName,
      lastName,
      email,
      cnic,
      userType: 'Student'
    });

    alert('Signup successful! You can now log in.');
    document.getElementById('signup').style.display = 'none';
    document.getElementById('login').style.display = 'block';
  } catch (error) {
    alert(error.message);
  }
});

// Handle Login (Same as before)
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      if (email === "admin@example.com") {
        document.getElementById('adminPortal').style.display = 'block';
        document.getElementById('login').style.display = 'none';
      } else {
        document.getElementById('studentPortal').style.display = 'block';
        document.getElementById('login').style.display = 'none';
      }
    })
    .catch((error) => {
      alert(error.message);
    });
});

// Additional functionalities like logout, editing profile, and viewing result remain the same.


// Add Student
document.getElementById('addStudentForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('studentEmail').value;
  const password = document.getElementById('studentPassword').value;
  const cnic = document.getElementById('studentCnic').value;
  const userType = 'Student';

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    await addDoc(collection(db, 'students'), { firstName, lastName, email, cnic, userType });
    alert('Student added successfully');
  } catch (error) {
    alert(error.message);
  }
});

// Upload Marks
document.getElementById('uploadMarksForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const course = document.getElementById('course').value;
  const studentId = document.getElementById('studentId').value;
  const marks = document.getElementById('marks').value;
  const totalMarks = document.getElementById('totalMarks').value;
  const grade = document.getElementById('grade').value;

  try {
    await setDoc(doc(db, 'marks', studentId), { course, marks, totalMarks, grade });
    alert('Marks uploaded successfully');
  } catch (error) {
    alert(error.message);
  }
});

// Edit Profile
document.getElementById('editProfileForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const firstName = document.getElementById('editFirstName').value;
  const lastName = document.getElementById('editLastName').value;
  const cnic = document.getElementById('editCnic').value;
  const user = auth.currentUser;

  try {
    const docRef = doc(db, 'students', user.uid);
    await setDoc(docRef, { firstName, lastName, cnic }, { merge: true });
    alert('Profile updated successfully');
  } catch (error) {
    alert(error.message);
  }
});

// View Result
document.getElementById('viewResultForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const cnic = document.getElementById('resultCnic').value;

  try {
    const docRef = doc(db, 'marks', cnic);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      document.getElementById('resultDisplay').innerText = JSON.stringify(docSnap.data());
    } else {
      alert('No result found');
    }
  } catch (error) {
    alert(error.message);
  }
});



// --- Firebase JS ---
const firebaseConfig = {
  apiKey: "AIzaSyCSn-dy59BPsAVrZNjuNfLvApHpQ035kr4",
  authDomain: "e-quizzit-capstone.firebaseapp.com",
  projectId: "e-quizzit-capstone",
  storageBucket: "e-quizzit-capstone.firebasestorage.app",
  messagingSenderId: "200557257873",
  appId: "1:200557257873:web:82a0a4f4bbe5927abe0b30"
};

// --- Firebase Imports ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Firebase error 
function friendlyError(err) {
  const code = err?.code || "";
  switch (code) {
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/missing-password":
      return "Please enter your password.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/user-not-found":
      return "No account found for that email.";
    default:
      return "Something went wrong. Please try again.";
  }
}

// Display message 
function msg(el, text, ok = false) {
  if (!el) return;
  el.textContent = text;
  el.style.color = ok ? "green" : "crimson";
}

// email/password from form
function getVals(form) {
  const email = form.querySelector('input[type="email"]')?.value?.trim() || "";
  const password = form.querySelector('input[type="password"]')?.value || "";
  return { email, password };
}

// first matching 
function pick(container, sels) {
  for (const s of sels) {
    const el = container.querySelector(s);
    if (el) return el;
  }
  return null;
}

/* ==== PASSWORD TOGGLE ==== */
(function bindPasswordToggle() {
  const input = document.getElementById("logPassword");
  const icon = document.getElementById("log-pass-icon");
  if (!input || !icon) return;
  icon.addEventListener("click", () => {
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    const name = icon.getAttribute("name");
    icon.setAttribute(
      "name",
      name === "eye-outline" ? "eye-off-outline" : "eye-outline"
    );
  });
})();

/* ==== LOGIN PAGE ==== */
const inputlogPassword = document.getElementById("logPassword")
const loginForm =
  document.getElementById("login-form") ||
  document.querySelector(".loginform");

if (loginForm) {
  const loginMsg =
    document.getElementById("login-message") ||
    pick(loginForm, ["#loginMsg", ".form-message", ".form-msg"]);

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    inputlogPassword.type = "password"
    const { email, password } = getVals(loginForm);
    if (!email || !password) return msg(loginMsg, "Enter email and password");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      msg(loginMsg, "Welcome back! Redirecting…", true);
      window.location.href = "dashboard.html";
    } catch (err) {
      msg(loginMsg, friendlyError(err));
    }
  });

  const forgotLink =
    document.getElementById("forgotLink") ||
    loginForm.querySelector(".forgot a");
  if (forgotLink) {
    forgotLink.addEventListener("click", (e) => {
      if (!forgotLink.getAttribute("href")) {
        e.preventDefault();
        window.location.href = "forgot.html";
      }
    });
  }
}

// Registration Page
const regForm = document.getElementById("registerform");

if (regForm) {
  const regMsg = document.getElementById("reg-message");

  // Password toggle
  const passInput = document.getElementById("regPassword");
  const passIcon = document.getElementById("reg-pass-icon");

  if (passInput && passIcon) {
    passIcon.addEventListener("click", () => {
      const isHidden = passInput.type === "password";
      passInput.type = isHidden ? "text" : "password";
      passIcon.setAttribute(
        "name",
        isHidden ? "eye-off-outline" : "eye-outline"
      );
    });
  }

  // Submit registration form
  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("regEmail").value.trim();
    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value;

    if (!email || !username || !password)
      return msg(regMsg, "Please fill out all fields.");

    try {
      // Create account
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // Update profile with username
      await updateProfile(user, { displayName: username });

      // Save in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        username,
      });

      msg(regMsg, "Account created! Redirecting…", true);

      setTimeout(() => {
        window.location.href = "dashboard.html";
        console.log("abot dito")
      }, 900);

    } catch (err) {
      const code = err?.code || "";

      msg(
        regMsg,
        code === "auth/email-already-in-use"
          ? "Email already registered."
          : code === "auth/weak-password"
          ? "Password must be at least 6 characters."
          : "Could not create account. Try again."
      );
    }
  });
}


/* ==== FORGOT PASSWORD PAGE ==== */
const forgotForm = document.getElementById("forgot-form");
if (forgotForm) {
  const forgotMsg = document.getElementById("forgot-msg");
  forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { email } = getVals(forgotForm);
    if (!email) return msg(forgotMsg, "Please enter your email");

    try {
      await sendPasswordResetEmail(auth, email);
      window.location.href = "forgot-sent.html";
    } catch (err) {
      msg(forgotMsg, friendlyError(err));
    }
  });
}

// Export Everything

export {
  app,
  auth,
  db,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  signOut,
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  addDoc,
  getDocs,
  friendlyError,
  msg,
  getVals,
  pick
};

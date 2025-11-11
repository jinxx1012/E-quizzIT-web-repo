// firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyCSn-dy59BPsAVrZNjuNfLvApHpQ035kr4",
  authDomain: "e-quizzit-capstone.firebaseapp.com",
  projectId: "e-quizzit-capstone",
  storageBucket: "e-quizzit-capstone.firebasestorage.app",
  messagingSenderId: "200557257873",
  appId: "1:200557257873:web:82a0a4f4bbe5927abe0b30"
};

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ------------------------- helpers ------------------------- */
function friendlyError(err) {
  const code = err?.code || "";
  switch (code) {
    case "auth/invalid-email": return "Invalid email address.";
    case "auth/user-not-found": return "No account found for that email.";
    default: return "Something went wrong. Please try again.";
  }
}
function msg(el, text, ok = false) {
  if (el) {
    el.textContent = text;
    el.style.color = ok ? "green" : "crimson";
  }
}
function getEmail(form) {
  if (!form) return "";
  return form.querySelector('input[type="email"]')?.value?.trim() || "";
}

/* ----------------------- forgot page ----------------------- */
const forgotForm = document.getElementById("forgot-form");
if (forgotForm) {
  const forgotMsg = document.getElementById("forgot-msg");

  forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = getEmail(forgotForm);
    if (!email) return msg(forgotMsg, "Please enter your email address");

    try {
      await sendPasswordResetEmail(auth, email);

      window.location.href = "forgot-sent.html";

    } catch (err) {
      msg(forgotMsg, friendlyError(err));
    }
  });
}

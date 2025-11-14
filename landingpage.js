
// index.js — Login + Register + Forgot Password

import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

// Helper Functions 

function friendlyError(err) {
  const code = err?.code || "";
  switch (code) {
    case "auth/invalid-email": return "Invalid email address.";
    case "auth/missing-password": return "Please enter your password.";
    case "auth/weak-password": return "Password should be at least 6 characters.";
    case "auth/email-already-in-use": return "Email already in use.";
    case "auth/wrong-password":
    case "auth/invalid-credential": return "Incorrect email or password.";
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

function bindToggle(input, icon) {
  if (!input || !icon) return;
  icon.addEventListener("click", () => {
    const hidden = input.type === "password";
    input.type = hidden ? "text" : "password";
    icon.setAttribute("name", hidden ? "eye-off-outline" : "eye-outline");
  });
}

function getVals(form) {
  if (!form) return {};
  const email = form.querySelector('input[type="email"]')?.value?.trim() || "";
  const password = form.querySelector('input[type="password"]')?.value || "";
  const username = form.querySelector('#regUsername, [name="username"]')?.value?.trim() || "";
  return { email, password, username };
}

//  LOGIN 

const loginForm = document.querySelector(".loginform");
if (loginForm) {
  const logMsg = loginForm.querySelector("#login-message");
  const logPassword = document.getElementById("logPassword");
  const logIcon = document.getElementById("log-pass-icon");

  // Enable password visibility toggle
  bindToggle(logPassword, logIcon);

  // Login submit
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { email, password } = getVals(loginForm);
    if (!email || !password) return msg(logMsg, "Enter email and password");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      msg(logMsg, "Welcome back! Redirecting...", true);
      setTimeout(() => window.location.href = "dashboard.html", 1500);
    } catch (err) {
      msg(logMsg, friendlyError(err));
    }
  });

  // Forgot password 
  const forgot = loginForm.querySelector(".forgot a");
  if (forgot) {
    forgot.addEventListener("click", async (e) => {
      e.preventDefault();
      const { email } = getVals(loginForm);
      if (!email) return msg(logMsg, "Enter your email first");

      try {
        await sendPasswordResetEmail(auth, email);
        msg(logMsg, "Password reset email sent!", true);
        setTimeout(() => window.location.href = "forgot-sent.html", 1500);
      } catch (err) {
        msg(logMsg, friendlyError(err));
      }
    });
  }
}

//  REGISTER 

const registerForm = document.querySelector(".registerform");
if (registerForm) {
  const regMsg = registerForm.querySelector("#reg-message");
  const regPassword = document.getElementById("regPassword");
  const regIcon = document.getElementById("reg-pass-icon");
  bindToggle(regPassword, regIcon);

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { email, password, username } = getVals(registerForm);
    if (!email || !password) return msg(regMsg, "Enter email and password");

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (username) await updateProfile(cred.user, { displayName: username });
      msg(regMsg, "Account created successfully! Redirecting...", true);
      setTimeout(() => window.location.href = "login.html", 1500);
    } catch (err) {
      msg(regMsg, friendlyError(err));
    }
  });
}


// AUTH REDIRECTS 

onAuthStateChanged(auth, (user) => {
  if (!user) return;

  const path = (location.pathname || "").toLowerCase();

  const isRegisterPage = path.endsWith("register.html") || path.endsWith("reg.html");
  const isLoginPage = path.endsWith("login.html");

  if (isRegisterPage) {
    window.location.href = "index.html";
  } else if (isLoginPage) {
    window.location.href = "dashboard.html";
  }
});

// PASSWORD TOGGLE 

export function bindPasswordToggle(input, icon) {
  if (!input || !icon) return;

  icon.style.cursor = "pointer";
  icon.addEventListener("click", () => {
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    icon.setAttribute("name", isHidden ? "eye-off-outline" : "eye-outline");
  });
}

export function initPasswordToggles() {
  const pairs = [
    ["#logPassword", "#log-pass-icon"],
    ["#regPassword", "#reg-pass-icon"]
  ];

  pairs.forEach(([inputSel, iconSel]) => {
    const input = document.querySelector(inputSel);
    const icon = document.querySelector(iconSel);
    if (input && icon) bindPasswordToggle(input, icon);
  });
}

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCSn-dy59BPsAVrZNjuNfLvApHpQ035kr4",
  authDomain: "e-quizzit-capstone.firebaseapp.com",
  projectId: "e-quizzit-capstone",
  storageBucket: "e-quizzit-capstone.firebasestorage.app",
  messagingSenderId: "200557257873",
  appId: "1:200557257873:web:82a0a4f4bbe5927abe0b30"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

function renderLoggedIn(user) {
  const navbarMenu = document.getElementById("navbarMenu");
  if (!navbarMenu) return;

  navbarMenu.innerHTML = "";

  const currentFile = location.pathname.split("/").pop().toLowerCase();
  const onAccountPage = currentFile === "acc.html";
  const targetHref = onAccountPage ? "dashboard.html" : "acc.html";

  const li = document.createElement("li");
  const profileLink = document.createElement("a");
  profileLink.classList.add("aa");
  profileLink.textContent = "Profile";
  profileLink.href = targetHref;

  li.appendChild(profileLink);
  navbarMenu.appendChild(li);
}

function renderLoggedOut() {
  const navbarMenu = document.getElementById("navbarMenu");
  if (!navbarMenu) return;
  navbarMenu.innerHTML = "";

  // Profile Button
  const li = document.createElement("li");
  const profileLink = document.createElement("a");
  profileLink.classList.add("aa");
  profileLink.textContent = "Profile";
  profileLink.href = "acc.html";

  li.appendChild(profileLink);
  navbarMenu.appendChild(li);
}

document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (user) renderLoggedIn(user);
    else renderLoggedOut();
  });
});
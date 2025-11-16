// Account Dashboard Script 

import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  onSnapshot,
  collection,
  getDocs,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

// --- Firebase Config 
const firebaseConfig = {
  apiKey: "AIzaSyCSn-dy59BPsAVrZNjuNfLvApHpQ035kr4",
  authDomain: "e-quizzit-capstone.firebaseapp.com",
  projectId: "e-quizzit-capstone",
  storageBucket: "e-quizzit-capstone.firebasestorage.app",
  messagingSenderId: "200557257873",
  appId: "1:200557257873:web:82a0a4f4bbe5927abe0b30"
};

// --- Initialize Firebase 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Elements 
const userNameEl = document.getElementById("userName");
const userEmailEl = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");
const avatarEl = document.getElementById("profileAvatar");
const achievementsGrid = document.getElementById("achievementsGrid");

// Avatar Display

function setAvatar(nameOrEmail, photoURL) {
  if (!avatarEl) return;

  
  if (photoURL) {
    photoURL = photoURL.replace(/^@\//, "./").replace(/^\/@\/?/, "./");
  }

  if (photoURL) {
    avatarEl.style.backgroundImage = `url(${photoURL})`;
    avatarEl.textContent = "";
    avatarEl.classList.add("has-photo");
  } else {
    const initial =
      (nameOrEmail && nameOrEmail.trim()[0])
        ? nameOrEmail.trim()[0].toUpperCase()
        : "U";
    avatarEl.style.backgroundImage = "";
    avatarEl.textContent = initial;
    avatarEl.classList.remove("has-photo");
  }
}

// Auth State Change

onAuthStateChanged(auth, async (user) => {
  if (user) {

    const userRef = doc(db, "users", user.uid);
    onSnapshot(userRef, (snap) => {
      const data = snap.data() || {};
      const name = data.username || user.displayName || "Anonymous User";
      const email = data.email || user.email || "";
      const photo = user.photoURL || data.photoURL || "";
      userNameEl.textContent = name;
      userEmailEl.textContent = email;
      setAvatar(name || email, photo);
    });

    //  Load achievements
    await loadAchievements(user.uid);
  } else {
    window.location.href = "login.html";
  }
});


async function loadAchievements(uid) {
  achievementsGrid.innerHTML = "<p>Loading achievements...</p>";

  try {
    const achievementsRef = collection(db, "users", uid, "Achievements");
    const querySnapshot = await getDocs(achievementsRef);

if (querySnapshot.empty) {
  achievementsGrid.style.display = "flex";   // override grid → flex
  achievementsGrid.style.flexDirection = "column";
  achievementsGrid.style.justifyContent = "center";
  achievementsGrid.style.alignItems = "center";

  achievementsGrid.innerHTML = '<p>No achievements yet.</p>';
  return;
}

// restore original grid when not empty
achievementsGrid.style.display = "grid";


    achievementsGrid.innerHTML = ""; 

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const { name, description, photoURL, dateUnlocked } = data;

      //  Sanitize the image path
      let sanitizedURL = photoURL || "./assets/medals/default.png";
      sanitizedURL = sanitizedURL.replace(/^@\//, "./").replace(/^\/@\/?/, "./");

      // Create achievement element
      const achievementEl = document.createElement("div");
      achievementEl.classList.add("achievement");

      achievementEl.innerHTML = `
        <div class="medal">
          <img 
            src="${sanitizedURL}" 
            alt="${name}" 
            onerror="this.onerror=null; this.src='./assets/medals/default.png';" 
          />
        </div>
        <div class="achievement-info">
          <p><strong>${name}</strong></p>
          <p>${description}</p>
          <small>${new Date(
            dateUnlocked?.seconds * 1000 || Date.now()
          ).toLocaleDateString()}</small>
        </div>
      `;

      achievementsGrid.appendChild(achievementEl);
    });
  } catch (error) {
    console.error("Error loading achievements:", error);
    achievementsGrid.innerHTML = "<p>Failed to load achievements.</p>";
  }
}

// Logout Button

logoutBtn?.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// Toast Notification Helper

function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "#222222";
  toast.style.color = "#F8FAFC";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "5px";
  toast.style.zIndex = "1000";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}


// Local Avatar Selection

const avatarOptions = document.querySelector(".avatar-options");
if (avatarOptions) {
  avatarOptions.querySelectorAll(".avatar-option").forEach((img) => {
    img.addEventListener("click", async () => {
      const selectedAvatar = img.getAttribute("src");
      const user = auth.currentUser;

      if (!user) {
        showToast("Please log in first.");
        return;
      }

      try {
        // Save to Firestore
        await setDoc(
          doc(db, "users", user.uid),
          { photoURL: selectedAvatar },
          { merge: true }
        );

        // Update profile immediately
        const profileAvatar = document.getElementById("profileAvatar");
        if (profileAvatar) profileAvatar.style.backgroundImage = `url(${selectedAvatar})`;

        // Update dropdown avatar
        const dropdownAvatar = document.getElementById("profilePic");
        if (dropdownAvatar) dropdownAvatar.src = selectedAvatar;

        showToast("Avatar updated successfully!");
      } catch (err) {
        console.error("Error saving avatar:", err);
        showToast("Error saving avatar: " + err.message);
      }
    });
  });
}
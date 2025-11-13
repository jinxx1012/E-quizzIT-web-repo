// main.js
document.addEventListener("DOMContentLoaded", () => {
    // Menu Buttons
    const menuBtn = document.querySelector(".menu-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    const navBar = document.querySelector(".navbar");

    if (menuBtn && cancelBtn && navBar) {
        menuBtn.onclick = function () {
            menuBtn.style.opacity = "0";
            menuBtn.style.pointerEvents = "none";
            navBar.classList.add("active");
        };

        cancelBtn.onclick = function () {
            menuBtn.style.opacity = "1";
            menuBtn.style.pointerEvents = "auto";
            navBar.classList.remove("active");
        };
    }

    // Sticky Navigation
    const nav = document.querySelector("nav");
    window.onscroll = function () {
        if (document.documentElement.scrollTop > 20) {
            nav.classList.add("sticky");
        } else {
            nav.classList.remove("sticky");
        }
    };
});
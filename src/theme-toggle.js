const toggleButton = document.getElementById("theme-toggle");
const icon = document.getElementById("theme-icon");
const body = document.body;

if (localStorage.getItem("theme") === "light") {
    body.classList.add("light-mode");
    icon.src = "/assets/icons/icon_moon_D.svg";
}

// Event-Listener für Klick auf den Button
toggleButton.addEventListener("click", () => {
    if (body.classList.contains("light-mode")) {
        body.classList.remove("light-mode");
        icon.src = "/assets/icons/icon_sun_B.svg";
        localStorage.setItem("theme", "dark");
    } else {
        body.classList.add("light-mode");
        icon.src = "/assets/icons/icon_moon_D.svg";
        localStorage.setItem("theme", "light");
    }
});

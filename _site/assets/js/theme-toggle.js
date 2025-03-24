document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const icons = document.querySelectorAll(".theme-icon-switch");

    const updateIcons = (isLightMode) => {
        themeIcon.src = isLightMode ? "/assets/icons/icon_moon_D.svg" : "/assets/icons/icon_sun_b.svg";
        icons.forEach(icon => {
            icon.src = isLightMode ? icon.dataset.light : icon.dataset.dark;
        });
    };

    const currentTheme = localStorage.getItem("theme") === "light";
    if (currentTheme) document.body.classList.add("light-mode");
    updateIcons(currentTheme);

    themeToggle.addEventListener("click", () => {
        const isLightMode = !document.body.classList.contains("light-mode");
        document.body.classList.toggle("light-mode");
        localStorage.setItem("theme", isLightMode ? "light" : "dark");
        updateIcons(isLightMode);
    });
});


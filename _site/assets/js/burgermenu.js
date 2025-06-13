document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('burger-toggle');
    const overlay = document.getElementById('burger-overlay');

    function closeMenu() {
        document.body.classList.remove('menu-open');
    }

    toggle.addEventListener('click', function () {
        document.body.classList.toggle('menu-open');
    });

    overlay.addEventListener('click', closeMenu);
});
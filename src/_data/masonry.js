document.querySelectorAll('.masonry-item').forEach(item => {
    const img = item.querySelector('img');
    if (img) {
        const height = img.getBoundingClientRect().height;
        item.style.setProperty('--item-height', height);
    }
});
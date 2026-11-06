(() => {
    const gallery = document.querySelector('.project-gallery');
    if (!gallery) return;
    const slides = [...gallery.querySelectorAll('.project-slide')];
    const controls = gallery.querySelector('.gallery-controls');
    const previous = gallery.querySelector('.gallery-previous');
    const next = gallery.querySelector('.gallery-next');
    const status = document.querySelector('#gallery-status');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const videos = slides.map(slide => slide.querySelector('video'));
    let current = 0;
    let moving = false;
    let touchStart = null;
    let animations = [];
    if (slides.length < 2) return;
    controls.hidden = false;

    function announce() {
        status.textContent = `${slides[current].querySelector('h1').textContent}, project ${current + 1} of ${slides.length}`;
    }

    function playCurrentVideo() {
        // Muted inline playback allows autoplay without a prior interaction.
        videos[current]?.play().catch(() => {
            // Playback controls remain available if the browser blocks autoplay.
        });
    }

    async function move(direction) {
        if (moving) return;
        moving = true;
        const oldSlide = slides[current];
        const nextIndex = (current + direction + slides.length) % slides.length;
        const newSlide = slides[nextIndex];
        videos[current]?.pause();
        // Move focus before making an outgoing project link inactive.
        if (oldSlide.contains(document.activeElement)) gallery.focus({ preventScroll: true });
        oldSlide.inert = true;
        oldSlide.setAttribute('aria-hidden', 'true');
        newSlide.hidden = false;
        newSlide.inert = true;
        newSlide.setAttribute('aria-hidden', 'true');
        newSlide.style.zIndex = '2';
        oldSlide.style.zIndex = '1';
        try {
            if (!motion.matches && typeof newSlide.animate === 'function') {
                const options = { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' };
                animations = [
                    oldSlide.animate([
                        { transform: 'translateX(0) scale(1)', opacity: 1 },
                        { transform: `translateX(${-direction * 100}%) scale(0.96)`, opacity: 0.4 }
                    ], options),
                    newSlide.animate([
                        { transform: `translateX(${direction * 100}%) scale(0.96)`, opacity: 0.6, boxShadow: '0 0 60px #0008' },
                        { transform: 'translateX(0) scale(1)', opacity: 1, boxShadow: '0 0 0 #0000' }
                    ], options)
                ];
                await Promise.all(animations.map(animation => animation.finished));
            }
        } catch {
            // If an animation is interrupted, settle on the requested project.
        } finally {
            oldSlide.hidden = true;
            newSlide.inert = false;
            newSlide.removeAttribute('aria-hidden');
            animations.forEach(animation => animation.cancel());
            animations = [];
            oldSlide.style.zIndex = '';
            newSlide.style.zIndex = '';
            current = nextIndex;
            moving = false;
            announce();
            playCurrentVideo();
        }
    }

    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    gallery.addEventListener('keydown', event => {
        if (event.target.closest('video, input, textarea, select, [contenteditable="true"]')) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            move(event.key === 'ArrowLeft' ? -1 : 1);
        }
    });
    gallery.addEventListener('touchstart', event => {
        touchStart = event.touches.length === 1 && event.target.closest('.project-video-space') && !event.target.closest('video')
            ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
    }, { passive: true });
    gallery.addEventListener('touchend', event => {
        if (!touchStart || !event.changedTouches.length) return;
        const dx = event.changedTouches[0].clientX - touchStart.x;
        const dy = event.changedTouches[0].clientY - touchStart.y;
        touchStart = null;
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1);
    }, { passive: true });
    gallery.addEventListener('touchcancel', () => { touchStart = null; }, { passive: true });
    motion.addEventListener('change', () => { if (motion.matches) animations.forEach(animation => animation.finish()); });
    announce();
    playCurrentVideo();
})();

(() => {
    const timeline = document.querySelector('.experience-timeline');
    if (!timeline) return;
    const landscape = timeline.closest('.experience-section').querySelector('.timeline-landscape');
    const entries = [...timeline.querySelectorAll('.timeline-entry')];
    const lastEntry = entries[entries.length - 1];
    const lastDot = lastEntry?.querySelector('.timeline-dot');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer;
    let frame;

    function updateProgress() {
        frame = null;
        const bounds = timeline.getBoundingClientRect();
        const distance = window.innerHeight * 0.78 - bounds.top;
        const lineHeight = lastDot
            ? lastEntry.offsetTop + lastDot.offsetTop + lastDot.offsetHeight / 2
            : bounds.height;
        timeline.style.setProperty('--timeline-line-height', `${lineHeight}px`);
        timeline.style.setProperty('--timeline-progress', Math.max(0, Math.min(1, distance / lineHeight)));
        if (!landscape) return;

        const sunProgress = motion.matches ? 0.5 : Math.max(0, Math.min(1, distance / bounds.height));
        landscape.style.setProperty('--sun-x', `${9 + 82 * sunProgress}%`);
        landscape.style.setProperty('--sun-y', `${69 - 45 * Math.sin(Math.PI * sunProgress)}%`);
        landscape.style.setProperty('--dawn', Math.max(0, 1 - 2 * sunProgress));
        landscape.style.setProperty('--dusk', Math.max(0, 2 * sunProgress - 1));
    }

    function scheduleProgress() {
        if (!frame) frame = window.requestAnimationFrame(updateProgress);
    }

    function configureReveal() {
        if (observer) observer.disconnect();
        if (motion.matches || !('IntersectionObserver' in window)) {
            timeline.classList.remove('timeline-ready');
            entries.forEach(entry => entry.classList.add('is-visible'));
            return;
        }
        observer = new IntersectionObserver(changes => {
            changes.forEach(change => {
                if (change.isIntersecting) {
                    change.target.classList.add('is-visible');
                    observer.unobserve(change.target);
                }
            });
        }, { rootMargin: '0px 0px -12% 0px', threshold: 0 });
        timeline.classList.add('timeline-ready');
        entries.forEach(entry => observer.observe(entry));
    }

    configureReveal();
    updateProgress();
    if ('ResizeObserver' in window) new ResizeObserver(scheduleProgress).observe(timeline);
    window.addEventListener('scroll', scheduleProgress, { passive: true });
    window.addEventListener('resize', scheduleProgress);
    window.addEventListener('pageshow', scheduleProgress);
    motion.addEventListener('change', () => {
        configureReveal();
        scheduleProgress();
    });
})();

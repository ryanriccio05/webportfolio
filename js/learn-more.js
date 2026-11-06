(() => {
    const section = document.querySelector('.learn-more');
    if (!section) return;
    const stage = section.querySelector('.learn-stage');
    const cards = [...stage.querySelectorAll('.learn-card')];
    if (cards.length < 2) return;
    const controls = section.querySelector('.learn-controls');
    const status = section.querySelector('.learn-status');
    const pauseButton = section.querySelector('[data-learn-pause]');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const step = Math.PI * 2 / cards.length;
    const duration = 10000;
    const bars = cards.map(card => card.querySelector('.learn-timer span'));
    let index = 0;
    let position = 0;
    let target = 0;
    let startPosition = 0;
    let animationStart = null;
    let elapsed = 0;
    let lastTime = null;
    let paused = motion.matches;
    let hovered = false;
    let visible = true;
    let radius = 300;
    let frame = null;

    section.classList.add('is-ready');
    controls.hidden = false;

    function measure() {
        radius = Math.min(390, stage.clientWidth * 0.38);
        render();
    }

    function render() {
        cards.forEach((card, i) => {
            const angle = i * step - position;
            const depth = (Math.cos(angle) + 1) / 2;
            const x = Math.sin(angle) * radius;
            const y = -65 * (1 - depth);
            const scale = 0.64 + depth * 0.36;
            const tilt = Math.sin(angle) * -20;
            card.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale}) rotateY(${tilt}deg)`;
            card.style.zIndex = String(Math.round(depth * 100));
        });
    }

    function updateActive() {
        cards.forEach((card, i) => {
            const active = i === index;
            card.classList.toggle('is-focused', active);
            card.setAttribute('aria-hidden', String(!active));
            card.inert = !active;
            card.setAttribute('role', 'group');
            card.setAttribute('aria-roledescription', 'slide');
            card.setAttribute('aria-label', `${i + 1} of ${cards.length}`);
            bars[i].style.transform = 'scaleX(1)';
        });
        hovered = cards[index].matches(':hover');
        status.textContent = `${index + 1} / ${cards.length}`;
    }

    function updatePauseButton() {
        pauseButton.setAttribute('aria-pressed', String(paused));
        pauseButton.setAttribute('aria-label', paused ? 'Play automatic rotation' : 'Pause automatic rotation');
        pauseButton.querySelector('i').className = paused ? 'fa fa-play' : 'fa fa-pause';
    }

    function move(direction) {
        // An unbounded angle keeps wraparound moving along the same circular path.
        target += direction * step;
        startPosition = position;
        animationStart = null;
        index = ((Math.round(target / step) % cards.length) + cards.length) % cards.length;
        elapsed = 0;
        updateActive();
        if (motion.matches) { position = target; render(); }
        wake();
    }

    function tick(time) {
        frame = null;
        const delta = lastTime === null ? 0 : time - lastTime;
        lastTime = time;
        if (position !== target) {
            if (animationStart === null) animationStart = time;
            const t = Math.min(1, (time - animationStart) / 850);
            const eased = 1 - Math.pow(1 - t, 3);
            position = t === 1 ? target : startPosition + (target - startPosition) * eased;
            render();
        } else if (!paused && !hovered && visible && !document.hidden) {
            elapsed += delta;
            if (elapsed >= duration) move(1);
        }
        bars[index].style.transform = `scaleX(${Math.max(0, 1 - elapsed / duration)})`;
        if (!document.hidden && visible && (position !== target || (!paused && !hovered))) wake();
        else lastTime = null;
    }

    function wake() {
        if (frame === null) frame = window.requestAnimationFrame(tick);
    }

    section.querySelector('[data-learn-prev]').addEventListener('click', () => move(-1));
    section.querySelector('[data-learn-next]').addEventListener('click', () => move(1));
    pauseButton.addEventListener('click', () => { paused = !paused; updatePauseButton(); wake(); });
    section.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault();
            // Keep keyboard focus out of a card as it becomes inactive.
            if (stage.contains(document.activeElement)) {
                section.querySelector(event.key === 'ArrowLeft' ? '[data-learn-prev]' : '[data-learn-next]').focus();
            }
            move(event.key === 'ArrowLeft' ? -1 : 1);
        }
    });
    cards.forEach((card, cardIndex) => {
        card.addEventListener('pointerenter', event => {
            if (event.pointerType !== 'touch' && cardIndex === index) hovered = true;
        });
        card.addEventListener('pointerleave', () => {
            if (cardIndex === index) { hovered = false; wake(); }
        });
        card.addEventListener('pointercancel', () => {
            if (cardIndex === index) { hovered = false; wake(); }
        });
    });
    document.addEventListener('visibilitychange', () => { lastTime = null; if (!document.hidden) wake(); });
    window.addEventListener('resize', measure);
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(stage);
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(changes => {
            visible = changes[0].isIntersecting;
            lastTime = null;
            if (visible) wake();
        }).observe(section);
    }
    motion.addEventListener('change', () => {
        paused = motion.matches;
        if (motion.matches) { position = target; render(); }
        updatePauseButton();
        wake();
    });
    updateActive();
    updatePauseButton();
    measure();
    wake();
})();

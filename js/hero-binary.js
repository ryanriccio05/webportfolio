(() => {
    const backdrop = document.querySelector('.hero-binary');
    if (!backdrop) return;

    const streams = document.createDocumentFragment();
    const columns = [];
    const columnCount = 64;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    for (let i = 0; i < columnCount; i += 1) {
        const stream = document.createElement('div');
        const digits = document.createElement('span');
        const length = 9 + Math.floor(Math.random() * 16);
        const duration = 9 + Math.random() * 12;
        const progress = Math.random();
        const column = (i + 0.4 + Math.random() * 0.2) / columnCount * 100;
        const bits = Array.from({ length }, () => Math.random() < 0.5 ? '0' : '1');

        stream.className = 'binary-stream';
        stream.style.setProperty('--column', `${column}%`);
        stream.style.setProperty('--length', length);
        stream.style.setProperty('--duration', `${duration}s`);
        stream.style.setProperty('--delay', `${-duration * progress}s`);
        stream.style.setProperty('--still-position', `${progress * 100}%`);
        stream.style.setProperty('--ink-opacity', 0.24 + Math.random() * 0.26);
        digits.textContent = bits.join('\n');

        columns.push({ digits, bits });
        stream.append(digits);
        streams.append(stream);
    }

    backdrop.append(streams);

    window.setInterval(() => {
        if (reducedMotion.matches || document.hidden) return;

        for (const { digits, bits } of columns) {
            if (Math.random() >= 0.34) continue;

            const first = Math.floor(Math.random() * bits.length);
            const second = (first + 1 + Math.floor(Math.random() * (bits.length - 1))) % bits.length;
            for (const index of [first, second]) {
                bits[index] = bits[index] === '0' ? '1' : '0';
            }

            digits.textContent = bits.join('\n');
        }
    }, 700);
})();

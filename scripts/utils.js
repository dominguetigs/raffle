function swap(a, b) {
    return [b, a];
}

function raffle(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function createArrayFromValuesRange(min, max) {
    return Array.from({ length: max - min + 1 }, (_, i) => i + min);
}

function initConffeti(element) {
    const config = {
        spread: 150,
        startVelocity: '100',
        elementCount: '250',
        width: '25px',
        height: '25px',
        perspective: '500px',
        colors: ['var(--primary)', 'var(--primary-2)', 'var(--secondary)', 'var(--white)'],
        duration: '5500',
    };
    confetti(element, config);
}

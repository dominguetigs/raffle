function raffle(min, max) {
    return Math.ceil(Math.random() * (max - min + 1) + min);
}

function initConffeti(element) {
    const config = {
        width: '20px',
        height: '20px',
        duration: '4000',
        elementCount: '200',
        startVelocity: '100',
        colors: ['var(--primary)', 'var(--primary-2)', 'var(--secondary)', 'var(--white)'],
    };
    confetti(element, config);
}

function raffle(min, max) {
    return Math.ceil(Math.random() * (max - min + 1) + min);
}

function initConffeti(element) {
    const config = {
        spread: 150,
        startVelocity: '100',
        elementCount: '300',
        width: '20px',
        height: '20px',
        perspective: '500px',
        colors: ['var(--primary)', 'var(--primary-2)', 'var(--secondary)', 'var(--white)'],
        duration: '7000',
        stagger: 2,
    };
    confetti(element, config);
}

const inputElement1 = document.querySelector('.input-container input:nth-child(1)');
const inputElement2 = document.querySelector('.input-container input:nth-child(2)');
const inputEditBtn = document.querySelector('.input-container i');
const raffleBtn = document.querySelector('.raffle-container button');

const raffleResultContainer = document.querySelector('.raffle-result-container');
const raffleResult = document.querySelector('.raffle-result');
const resultConfettiElement = document.getElementById('result-confetti');
const resultCloseBtn = document.querySelector('.close-result-btn');

const raffleAudio = document.getElementById('raffle-audio');

inputEditBtn.addEventListener('click', () => {
    inputElement1.disabled = false;
    inputElement2.disabled = false;
    inputElement1.focus();
});

raffleBtn.addEventListener('click', () => {
    raffleAudio.currentTime = 0;
    raffleAudio.play();

    const principalTimeout = setTimeout(() => {
        raffleBtn.disabled = true;
        raffleResultContainer.style.visibility = 'visible';
        raffleResultContainer.style.opacity = 1;

        const maxLoop = 215;
        const timeouts = [];

        for (let i = 1; i <= maxLoop; i++) {
            const timeout = setTimeout(() => {
                raffleResult.innerHTML = raffle(inputElement1.value, inputElement2.value);
            }, 25 * i);
            timeouts.push(timeout);
        }

        const timeout = setTimeout(() => {
            initConffeti(resultConfettiElement);
            raffleResult.style.color = 'var(--white)';
            resultCloseBtn.style.opacity = 1;
            timeouts.forEach((timer) => clearTimeout(timer));
            clearTimeout(timeout);
        }, 25 * maxLoop);

        clearTimeout(principalTimeout);
    }, 500);
});

resultCloseBtn.addEventListener('click', () => {
    resultCloseBtn.style.opacity = 0;
    raffleResultContainer.style.opacity = 0;

    const timeout = setTimeout(() => {
        raffleBtn.disabled = false;
        raffleResultContainer.style.visibility = 'hidden';
        clearTimeout(timeout);
    }, 1000);
});

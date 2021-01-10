const inputElements = document.querySelectorAll('.input-container input');
const extraInfoLink = document.querySelector('a.extra-info-link');
const raffleBtn = document.querySelector('.raffle-container button');

const numbersViewDialog = document.querySelector('.numbers-view-dialog');
const closeExtraInfoBtn = document.querySelector('i.close-extra-info-btn');
const selectedNumberCount = document.querySelector('span.selected-number-count');
const numbersViewContainer = document.querySelector('.numbers-view-container');

const raffleResultContainer = document.querySelector('.raffle-result-container');
const raffleResult = document.querySelector('.raffle-result');
const resultConfettiElement = document.getElementById('result-confetti');
const resultCloseBtn = document.querySelector('.close-result-btn');

const raffleAudio = document.getElementById('raffle-audio');

const selectedNumbersRange = {
    min: {
        previousValue: undefined,
        currentValue: +inputElements[0].value,
    },
    max: {
        previousValue: undefined,
        currentValue: +inputElements[1].value,
    },
};

let selectedNumbersToRaffle = [];

function inputValuesChanged() {
    return (
        selectedNumbersRange.min.currentValue !== selectedNumbersRange.min.previousValue ||
        selectedNumbersRange.max.currentValue !== selectedNumbersRange.max.previousValue
    );
}

function createValuesRangeFromInputValues() {
    const minValue = selectedNumbersRange.min.currentValue;
    const maxValue = selectedNumbersRange.max.currentValue;
    return createArrayFromValuesRange(minValue, maxValue);
}

function resetSelectedNumbersToRaffle() {
    selectedNumbersToRaffle = createValuesRangeFromInputValues();
}

function createNumbersViewBoxes() {
    if (inputValuesChanged()) {
        const viewBoxesRange = selectedNumbersToRaffle;

        numbersViewContainer.innerHTML = '';

        for (const n of viewBoxesRange) {
            const numberViewBoxElement = document.createElement('div');
            numberViewBoxElement.classList.add('number-view-box');
            numberViewBoxElement.classList.add('selected');

            const viewBoxNumberElement = document.createElement('span');
            viewBoxNumberElement.classList.add('number');

            const numberValue = document.createTextNode(n);

            viewBoxNumberElement.appendChild(numberValue);
            numberViewBoxElement.appendChild(viewBoxNumberElement);
            numbersViewContainer.append(numberViewBoxElement);
        }

        selectedNumbersRange.min.previousValue = selectedNumbersRange.min.currentValue;
        selectedNumbersRange.max.previousValue = selectedNumbersRange.max.currentValue;
    }
}

inputElements.forEach((input) =>
    input.addEventListener('blur', (e) => {
        if ([...e.target.classList].indexOf('min-value-input') !== -1) {
            selectedNumbersRange.min.previousValue = selectedNumbersRange.min.currentValue;
            selectedNumbersRange.min.currentValue = +e.target.value;
        } else {
            selectedNumbersRange.max.previousValue = selectedNumbersRange.max.currentValue;
            selectedNumbersRange.max.currentValue = +e.target.value;
        }
        resetSelectedNumbersToRaffle();
        createNumbersViewBoxes();
    })
);

numbersViewContainer.addEventListener('click', (e) => {
    const parentElement = [...e.target.classList].indexOf('number') !== -1 ? e.target.parentElement : e.target;
    const numbersRange = parentElement.parentElement.children.length;
    const selectedNumber = +parentElement.children[0].innerHTML;

    if ([...parentElement.classList].indexOf('selected') !== -1) {
        parentElement.classList.remove('selected');
        selectedNumbersToRaffle.splice(selectedNumbersToRaffle.indexOf(selectedNumber), 1);
    } else {
        parentElement.classList.add('selected');
        selectedNumbersToRaffle.push(selectedNumber);
    }

    selectedNumberCount.innerHTML =
        numbersRange === selectedNumbersToRaffle.length
            ? 'Todos números selecionados'
            : `${selectedNumbersToRaffle.length} números selecionados`;
});

extraInfoLink.addEventListener('click', () => {
    numbersViewDialog.style.visibility = 'visible';
    numbersViewDialog.style.opacity = 1;
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

        const minValue = 0;
        const maxValue = selectedNumbersToRaffle.length - 1;

        for (let i = 1; i <= maxLoop; i++) {
            const timeout = setTimeout(() => {
                raffleResult.innerHTML = selectedNumbersToRaffle[raffle(minValue, maxValue)];
            }, 25 * i);
            timeouts.push(timeout);
        }

        const timeout = setTimeout(() => {
            initConffeti(resultConfettiElement);
            raffleResult.style.color = 'var(--white)';
            resultCloseBtn.style.visibility = 'visible';
            resultCloseBtn.style.opacity = 1;
            timeouts.forEach((timer) => clearTimeout(timer));
            clearTimeout(timeout);
        }, 25 * maxLoop);

        clearTimeout(principalTimeout);
    }, 500);
});

closeExtraInfoBtn.addEventListener('click', () => {
    numbersViewDialog.style.opacity = 0;
    const timeout = setTimeout(() => {
        numbersViewDialog.style.visibility = 'hidden';
        clearTimeout(timeout);
    }, 500);
});

resultCloseBtn.addEventListener('click', () => {
    resultCloseBtn.style.opacity = 0;
    raffleResultContainer.style.opacity = 0;

    const timeout = setTimeout(() => {
        raffleBtn.disabled = false;
        resultCloseBtn.style.visibility = 'hidden';
        raffleResultContainer.style.visibility = 'hidden';
        clearTimeout(timeout);
    }, 1000);
});

resetSelectedNumbersToRaffle();
createNumbersViewBoxes();

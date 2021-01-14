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

// ?n=2,3,4,6,7,8,9,10,11,12,13,14,15,16,17,19,20,21,22,24,25,26,27,28,29,30,31,35,36,37,40,42,44,45,46,48,52,53,54,61,63,66,69,70,72,75,77,80,89,95,100
let selectedNumbersToRaffle =
    new URLSearchParams(window.location.search)
        .get('n')
        ?.split(',')
        .map((n) => +n) || createValuesRangeFromInputValues();

function updateUrlParams() {
    history.replaceState(null, null, `?n=${selectedNumbersToRaffle.join(',')}`);
}

function inputValuesIsEmpty() {
    return !inputElements[0].value || !inputElements[1].value;
}

function inputValuesIsReversed() {
    return selectedNumbersRange.min.currentValue > selectedNumbersRange.max.currentValue;
}

function inputValuesIsEqual() {
    return selectedNumbersRange.min.currentValue === selectedNumbersRange.max.currentValue;
}

function hasWarningMessage() {
    let hasWarning = false;

    if (inputValuesIsEmpty()) {
        toastr.warning('Sem número suficiente para criar sorteio.');
        hasWarning = true;
    } else if (inputValuesIsEqual()) {
        toastr.warning('Números não podem ser iguais.');
        hasWarning = true;
    } else if (inputValuesIsReversed()) {
        toastr.warning('Primeiro número não pode ser maior que o segundo.');
        hasWarning = true;
    }

    return hasWarning;
}

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

function createNumbersViewBoxes() {
    if (inputValuesChanged()) {
        updateUrlParams();
        const viewBoxesRange = createValuesRangeFromInputValues();

        numbersViewContainer.innerHTML = '';

        for (const n of viewBoxesRange) {
            const numberViewBoxElement = document.createElement('div');
            numberViewBoxElement.classList.add('number-view-box');

            if (selectedNumbersToRaffle.indexOf(n) !== -1) {
                numberViewBoxElement.classList.add('selected');
            }

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
        selectedNumberCount.innerHTML = 'Todos números selecionados';
        selectedNumbersToRaffle = createValuesRangeFromInputValues();
        updateUrlParams();
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
        updateUrlParams();
    } else {
        parentElement.classList.add('selected');
        selectedNumbersToRaffle.push(selectedNumber);
        updateUrlParams();
    }

    selectedNumberCount.innerHTML =
        numbersRange === selectedNumbersToRaffle.length
            ? 'Todos números selecionados'
            : `${selectedNumbersToRaffle.length} números selecionados`;
});

extraInfoLink.addEventListener('click', () => {
    if (!hasWarningMessage()) {
        numbersViewDialog.style.visibility = 'visible';
        numbersViewDialog.style.opacity = 1;
    }
});

raffleBtn.addEventListener('click', () => {
    if (!hasWarningMessage()) {
        raffleAudio.currentTime = 1;
        raffleAudio.play();

        if (!raffleAudio.paused) {
            raffleBtn.disabled = true;
            raffleResultContainer.style.visibility = 'visible';
            raffleResultContainer.style.opacity = 1;

            const maxLoop = 200;
            const minValue = 0;
            const maxValue = selectedNumbersToRaffle.length - 1;
            const timeouts = [];

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
        }
    }
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
    raffleBtn.disabled = false;

    const timeout = setTimeout(() => {
        resultCloseBtn.style.visibility = 'hidden';
        raffleResultContainer.style.visibility = 'hidden';
        clearTimeout(timeout);
    }, 400);
});

createNumbersViewBoxes();

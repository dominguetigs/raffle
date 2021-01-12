const toastrElement = document.querySelector('.toastr');

let toastrTimeout;

toastrElement.addEventListener('click', () => {
    toastrElement.style.opacity = 0;
    const timeout = setTimeout(() => {
        clearTimeout(toastrTimeout);
        clearTimeout(timeout);
    }, 500);
});

function openToastr(action, message) {
    toastrElement.classList.remove('success', 'info', 'warning', 'error');
    toastrElement.classList.add(action);
    toastrElement.innerHTML = message;
    toastrElement.style.opacity = 1;

    toastrTimeout = setTimeout(() => {
        toastrElement.style.opacity = 0;
        clearTimeout(toastrTimeout);
    }, 4000);
}

const toastr = {
    success: (message) => openToastr('success', message),
    info: (message) => openToastr('info', message),
    warning: (message) => openToastr('warning', message),
    error: (message) => openToastr('error', message),
};

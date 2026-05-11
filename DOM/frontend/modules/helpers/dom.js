export function showError(errorElement, message) {
    errorElement.textContent = message;
}

export function clearError(errorElement, inputElement) {
    errorElement.textContent = '';
    inputElement.classList.remove('error');
}

export function isValidInput(input, message, errorElement){
    if (!input.value.trim()) {
        showError(errorElement, message);
        input.classList.add('error');
        return false;
    }else{
        clearError(errorElement, input);
        return true;
    }
}
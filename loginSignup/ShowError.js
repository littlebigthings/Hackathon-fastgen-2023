function showError(elementToInject, errorMessage = "Something went wrong, please try again!"){
    if(elementToInject != null){
        let findCurrentError = document.querySelector("[data-id='error']");
        findCurrentError?.remove();
        let errorElement = document.createElement("div");
        errorElement.style.color = "red";
        errorElement.style.fontSize = "12px";
        errorElement.setAttribute("data-id", "error");
        errorElement.textContent = errorMessage;
        elementToInject.insertAdjacentElement("afterend", errorElement);
    }
}

export default showError;
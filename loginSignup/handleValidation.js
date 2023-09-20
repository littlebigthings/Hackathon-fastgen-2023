function validate(inputElement, validatePassword = false) {
    const input = inputElement;
    const inputType = inputElement.getAttribute("input-type");
    // Define the regular expressions for password validation
    const minLength = 8; // Minimum length of the password
    const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const digitRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*()_+[\]{};':"\\|,.<>/?-]/;
    if (validatePassword && inputType == "password") {
        if (
            input.value.length >= minLength &&
            upperCaseRegex.test(input.value) &&
            lowerCaseRegex.test(input.value) &&
            digitRegex.test(input.value) &&
            specialCharRegex.test(input.value)
        ) {
            input.setCustomValidity("");
        }
        else {
            input.setCustomValidity("Password is invalid. It must contain at least 8 characters, including uppercase, lowercase, digit, and special character.");
            setTimeout(()=>input.setCustomValidity(""), 1000)
        }
    }else if(inputType === "email"){
        if (input.value.trim() === "") {
            input.setCustomValidity("Email field is empty.");
        }
        else {
            // Email validation using a regular expression
            const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            if (emailRegex.test(input.value)) {
                input.setCustomValidity("");
            }
            else {
                input.setCustomValidity("Invalid email address.");
                setTimeout(()=>input.setCustomValidity(""), 1000)
            }
        }
    }
    return input.reportValidity();

}

export default validate;
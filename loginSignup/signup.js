import fetchApiData from "./APIcall.js";
import setLoginToken from "./SetToken.js";
import validate from "./handleValidation.js";
import showError from "./ShowError.js";

let signupForm
function handleSignUp() {
    // All data fileds
    signupForm = document.querySelector("[form-type='signup']")
    let nameField = signupForm?.querySelector("[input-type='name']");
    let emailField = signupForm?.querySelector("[input-type='email']");
    let passwordField = signupForm?.querySelector("[input-type='password']");
    let signupBtn = signupForm?.querySelector("[btn-type='signup']");

    // Checks
    if (nameField != null && emailField != null && passwordField != null && signupBtn != null) {
        // submit listener
        signupBtn.addEventListener("click", () => {
            let nameVal = nameField.value;
            let emailVal = emailField.value;
            let passwordVal = passwordField.value;
            // validation for each fields
            if (validate(nameField) && validate(emailField) && validate(passwordField, true)) {
                // Call API
                callSignup({
                    userName: nameVal,
                    Email: emailVal,
                    Password: passwordVal
                })
            }
        })
    }
}

// Signup API call
function callSignup(userSignupData) {
    let options = {
        "method": "POST",
        "content-type": "application/json",
        "body": JSON.stringify(userSignupData)
    }
    let url = "https://metatags-generator.fastgenapp.com/signup";

    fetchApiData(url, options)
        .then((data) => {
            console.log("API Data:", data);
            let jwtToken = data.token?.Data?.token;
            if (jwtToken) {
                let tokenAdded = setLoginToken("jwtToken",jwtToken);
                // Redirect to dashboard page.
                if(tokenAdded)window.location.assign("/dashboard");

            }
        })
        .catch((error) => {
            console.error("API Error:", error);
            // Show error.
            showError(signupForm, error)
        });
}

export default handleSignUp;
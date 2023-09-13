import fetchApiData from "./APIcall.js";
import setLoginToken from "./SetToken.js";
import validate from "./handleValidation.js";
import showError from "./ShowError.js";

let loginForm
function handleLogin() {
    // All data fields.
    loginForm = document.querySelector("[form-type='login']")
    let emailField = loginForm?.querySelector("[input-type='email']");
    let passwordField = loginForm?.querySelector("[input-type='password']");
    let loginBtn = loginForm?.querySelector("[btn-type='login']");
    // Checks.
    if (emailField != null && passwordField != null && loginBtn != null) {
        // Listener.
        loginBtn.addEventListener("click", () => {
            let emailVal = emailField.value;
            let passwordVal = passwordField.value;
            // Validations.
            if (validate(emailField) && validate(passwordField)) {
                //Call API.
                callLogin({
                    Email: emailVal,
                    Password: passwordVal
                })
            }
        })
    }
}

function callLogin(userSignupData) {
    let options = {
        "method": "POST",
        "content-type": "application/json",
        "body": JSON.stringify(userSignupData)
    }
    let url = "https://metatags-generator.fastgenapp.com/login";

    fetchApiData(url, options)
        .then((data) => {
            console.log("API Data:", data.token.Data);
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
            showError(loginForm, error)
        });
}

export default handleLogin;
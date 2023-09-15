import fetchApiData from "./APIcall.js";
import setLoginToken from "./SetToken.js";
import validate from "./handleValidation.js";
import showError from "./ShowError.js";

let loginForm, loginBtn, loaderWrapper;
function handleLogin() {
    // All data fields.
    loginForm = document.querySelector("[form-type='login']")
    let emailField = loginForm?.querySelector("[input-type='email']");
    let passwordField = loginForm?.querySelector("[input-type='password']");
    loginBtn = loginForm?.querySelector("[btn-type='login']");
    let loaderWrapperToClone = document.querySelector("[wrapper='loader']");
    // Checks.
    if (emailField != null && passwordField != null && loginBtn != null) {
        // Listener.
        loginBtn.addEventListener("click", () => {
            let emailVal = emailField.value;
            let passwordVal = passwordField.value;
            // Validations.
            if (validate(emailField) && validate(passwordField)) {
                // disable login btn
                loginBtn.textContent = "";
                loaderWrapper = loaderWrapperToClone.cloneNode(true);
                loginBtn.appendChild(loaderWrapper);
                loaderWrapper.classList.remove("hide-wrapper");
                loginBtn.style.pointerEvents = "none";
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
                let tokenAdded = setLoginToken("jwtToken", jwtToken);
                // Redirect to dashboard page.
                if (tokenAdded) window.location.assign("/dashboard");
            }
        })
        .catch((error) => {
            console.error("API Error:", error);
            // Show error.
            loginBtn.textContent = "Try again!"
            loaderWrapper.classList.add("hide-wrapper");
            loginBtn.style.pointerEvents = "auto";
            showError(loginForm, error)
        });
}

export default handleLogin;
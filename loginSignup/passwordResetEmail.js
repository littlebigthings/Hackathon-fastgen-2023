import fetchApiData from "./APIcall.js";
import validate from "./handleValidation.js";
import showError from "./ShowError.js";
import setLoginToken from "./SetToken.js";
import { openScreen } from "./SwitchScreens.js";

let passwordResetForm, optBtn, loaderWrapper;
function handlePasswordReset() {
    // All data fields.
    passwordResetForm = document.querySelector("[form-type='password-reset']")
    let emailField = passwordResetForm?.querySelector("[input-type='email']");
    optBtn = passwordResetForm?.querySelector("[btn-type='send-otp']");
    let loginbtn = passwordResetForm?.querySelector("[btn-type='login']");
    let loaderWrapperToclone = document.querySelector("[wrapper='loader-dark']");
    // Ask for resend opt
    // let resentOtpn = document.querySelector()

    // Checks.
    if (emailField != null && optBtn != null && loginbtn != null) {
        // Listener.
        optBtn.addEventListener("click", () => {
            let emailVal = emailField.value;
            // Validations.
            if (validate(emailField)) {
                // disable login btn
                loaderWrapper = loaderWrapperToclone.cloneNode(true)
                optBtn.textContent = ""
                optBtn.appendChild(loaderWrapper);
                loaderWrapper.classList.remove("hide-wrapper");
                optBtn.style.pointerEvents = "none";
                //Call API.
                callLogin({
                    Email: emailVal,
                })
            }
        })

        loginbtn.addEventListener("click", () => {
            openScreen("login");
        })
    }
}

function callLogin(userSignupData) {
    let options = {
        "method": "POST",
        "content-type": "application/json",
        "body": JSON.stringify(userSignupData)
    }
    let url = "https://metatags-generator.fastgenapp.com/recover";

    fetchApiData(url, options)
        .then((data) => {
            // console.log("API Data:", data);
            let optToken = data?.resetData?.Data?.resetData?.token;
            if (optToken) {

                let tokenAdded = setLoginToken("otp", optToken);
                // open otp screen
                if(tokenAdded)openScreen("otp");
            }
        })
        .catch((error) => {
            console.error("API Error:", error);
            // Show error.
            // disable login btn
            optBtn.textContent = "Try again!"
            loaderWrapper.classList.add("hide-wrapper");
            optBtn.style.pointerEvents = "auto";
            showError(passwordResetForm, error)
        });
}

export default handlePasswordReset;
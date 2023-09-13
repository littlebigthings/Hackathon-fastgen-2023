import fetchApiData from "./APIcall.js";
import validate from "./handleValidation.js";
import showError from "./ShowError.js";
import setLoginToken from "./SetToken.js";
import { openScreen } from "./SwitchScreens.js";

let passwordResetForm
function handlePasswordReset() {
    // All data fields.
    passwordResetForm = document.querySelector("[form-type='password-reset']")
    let emailField = passwordResetForm?.querySelector("[input-type='email']");
    let optBtn = passwordResetForm?.querySelector("[btn-type='send-otp']");
    
    // Ask for resend opt
    // let resentOtpn = document.querySelector()
    
    // Checks.
    if (emailField != null && optBtn != null) {
        // Listener.
        optBtn.addEventListener("click", () => {
            let emailVal = emailField.value;
            // Validations.
            if (validate(emailField)) {
                //Call API.
                callLogin({
                    Email: emailVal,
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
    let url = "https://metatags-generator.fastgenapp.com/recover";

    fetchApiData(url, options)
        .then((data) => {
            // console.log("API Data:", data);
            let optToken = data?.resetData?.Data?.resetData?.token;
            if (optToken) {

                let tokenAdded = setLoginToken("otp",optToken);
                // open otp screen
                if(tokenAdded)openScreen("otp");
            }
        })
        .catch((error) => {
            console.error("API Error:", error);
            // Show error.
            showError(passwordResetForm, error)
        });
}

export default handlePasswordReset;
import fetchApiData from "./APIcall.js";
import validate from "./handleValidation.js";
import showError from "./ShowError.js";
import checkToken from "./CheckToken.js";
import removeToken from "./removeToken.js";
import {openScreen} from "./SwitchScreens.js";

let newPasswordForm;
function setNewPassword() {
    // All data fields.
    newPasswordForm = document.querySelector("[form-type='new-password']")
    let passwordField = newPasswordForm?.querySelector("[input-type='password']");
    let confirmPasswordField = newPasswordForm?.querySelector("[input-type='confirm-password']");
    let passwordResetBtn = newPasswordForm?.querySelector("[btn-type='reset-password']");
    // Checks.
    if (confirmPasswordField != null && passwordField != null && passwordResetBtn != null) {
        // Listener.
        passwordResetBtn.addEventListener("click", () => {
            let password = passwordField.value;
            let confirmPassword = confirmPasswordField.value;
            let tokenVal = checkToken("otp");
            // Validations.
            if (validate(passwordField, true) && validate(confirmPasswordField)) {
                if (password == confirmPassword) {
                    //Call API.
                    callLogin({
                        newPassword: password,
                        token: tokenVal
                    })
                }else{
                    showError(newPasswordForm, "Password does not match!")
                }
            }
        })
    }
}

function callLogin(userData) {
    let options = {
        "method": "POST",
        "content-type": "application/json",
        "body": JSON.stringify(userData)
    }
    let url = "https://metatags-generator.fastgenapp.com/change-password";

    fetchApiData(url, options)
        .then((data) => {
            if (data) {
                openScreen("login");
                removeToken("otp");
            }
        })
        .catch((error) => {
            console.error("API Error:", error);
            // Show error.
            showError(newPasswordForm, error)
        });
}
export default setNewPassword;
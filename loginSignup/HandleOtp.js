import showError from "./ShowError.js";
import checkToken from "./CheckToken.js";
import validate from "./handleValidation.js";
import { openScreen } from "./SwitchScreens.js";

let otpForm
function handleOtp() {
    // All data fields.
    otpForm = document.querySelector("[form-type='otp']")
    let otpNumber = otpForm?.querySelector("[input-type='otp']");
    let otpBtn = otpForm?.querySelector("[btn-type='reset']");

    // Ask for resend opt
    // let resentOtpn = document.querySelector()
    // Checks.
    if (otpNumber != null && otpBtn != null) {
        // Listener.
        otpBtn.addEventListener("click", () => {
            let otpVal = otpNumber.value;
            // Validations.
            if (validate(otpNumber)) {
                matchOtp(otpVal, otpNumber)
            }
        })
    }
}

function matchOtp(otp, inputElement) {
    let getStoredOtp = checkToken("otp");
    if (getStoredOtp === otp) {
        openScreen("new-password");
    } else {
        inputElement.setCustomValidity("OTP is incorrect");
        // showError(otpForm, "Wrong otp, try again!")
        setTimeout(() => inputElement.setCustomValidity(""), 1000)
        inputElement.reportValidity();
    }

}

export default handleOtp;
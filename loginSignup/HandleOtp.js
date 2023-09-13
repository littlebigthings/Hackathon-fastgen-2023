import showError from "./ShowError.js";
import checkToken from "./CheckToken.js";
import validate from "./handleValidation.js";
import { openScreen } from "./SwitchScreens.js";

let otpForm
function handleOtp() {
    // All data fields.
    otpForm = document.querySelector("[form-type='otp']")
    let optNumber = otpForm?.querySelector("[input-type='otp']");
    let otpBtn = otpForm?.querySelector("[btn-type='reset']");
    
    // Ask for resend opt
    // let resentOtpn = document.querySelector()
    // Checks.
    if (optNumber != null && otpBtn != null) {
        // Listener.
        otpBtn.addEventListener("click", () => {
            let otpVal = optNumber.value;
            // Validations.
            if (validate(optNumber)) {
                matchOtp(otpVal)
            }
        })
    }
}

function matchOtp(otp) {
    let getStoredOtp = checkToken("otp");
    if(getStoredOtp === otp){
        openScreen("new-password");
    }else{
        showError(otpForm,"Wrong otp, try again!")
    }
    
}

export default handleOtp;
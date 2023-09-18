import handleLogin from "./login.js";
import handleSignUp from "./signup.js";
import switchScreens from "./SwitchScreens.js";
import handlePasswordReset from "./passwordResetEmail.js"
import handleOtp from "./HandleOtp.js";
import setNewPassword from "./newPassword.js";
import checkUserAlreadyLoggedIn from "./userAlreadyLogged.js";

handleLogin();
handleSignUp();
switchScreens();
handlePasswordReset();
handleOtp();
setNewPassword();
checkUserAlreadyLoggedIn();
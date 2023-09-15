import fetchApiData from "../loginSignup/APIcall.js";
import checkToken from "../loginSignup/CheckToken.js";

function callAuth() {
    let jwtToken = checkToken("jwtToken");
    let clientID = "0cce4c67243c5ea9c70ebb3f2e936762892ed851f5a3035f8b775e529d9a7dd9";
    let url = "https://metatags-generator.fastgenapp.com/access-token";

    let pageURl = new URL(document.location);
    let authCode = pageURl.searchParams.get("code");

    let options = {
        "method": "POST",
        "content-type": "application/json",
        "body": JSON.stringify({
            "token": jwtToken,
            "authCode": authCode,
            "clientId": clientID
        })
    }

    fetchApiData(url, options)
        .then((data) => {
            console.log("API Data:", data);
            if (data) {
                window.location.assign("/dashboard");
            }
        })
        .catch((error) => {
            console.error("API Error:", error);
            // Show error.
        });
}

callAuth()
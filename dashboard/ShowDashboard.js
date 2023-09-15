import checkToken from "../loginSignup/CheckToken.js";
import fetchApiData from "../loginSignup/APIcall.js";

function showDashBoard() {
    let jwtToken = checkToken("jwtToken");
    let url = "https://metatags-generator.fastgenapp.com/get-site-info";
    let options = {
        "method": "POST",
        "content-type": "application/json",
        "body": JSON.stringify({
            "token": jwtToken,
        })
    }
    fetchApiData(url, options)
        .then((data) => {
            console.log("API Data:", data);
            let checkSites = data.siteData?.Data?.Response;
            if (checkSites?.length > 0) {
                showSites(checkSites)
            }

        })
        .catch((error) => {
            console.error("API Error:", error);
            // Show error.
        });
}

function showSites(sitesArray) {
    let parentWrapper = document.querySelector("[wrapper='site-info']").parentElement;
    let siteInfoWrapper = document.querySelector("[wrapper='site-info']");
    let name, image, showMetaBtn, showSchemaBtn;
    if (siteInfoWrapper != undefined) {
        sitesArray.forEach(site => {
            let { displayName, previewUrl, id, customDomains, shortName } = site;
            let clonedWrapper = siteInfoWrapper.cloneNode(true);
            name = clonedWrapper.querySelector("[show-data='name']");
            image = clonedWrapper.querySelector("[show-data='img']");
            showSchemaBtn = clonedWrapper.querySelector("[show-data='pages-schema']");
            showMetaBtn = clonedWrapper.querySelector("[show-data='pages-meta']");
            name.textContent = displayName;
            image.setAttribute("src", previewUrl);
            if (customDomains.length > 0) {
                showSchemaBtn.setAttribute("href", `/site-pages-schema?siteId=${id}&url=${customDomains[0].url}`);
                showMetaBtn.setAttribute("href", `/site-pages-meta?siteId=${id}&url=${customDomains[0].url}`);
            } else {
                showSchemaBtn.setAttribute("href", `/site-pages-schema?siteId=${id}&url=${shortName}.webflow.io`);
                showMetaBtn.setAttribute("href", `/site-pages-meta?siteId=${id}&url=${shortName}.webflow.io`);
            }

            parentWrapper.appendChild(clonedWrapper);
        })
    }
}
showDashBoard();
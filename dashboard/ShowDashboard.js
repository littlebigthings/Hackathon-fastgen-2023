import checkToken from "../loginSignup/CheckToken.js";
import fetchApiData from "../loginSignup/APIcall.js";
import addLogout from "./logout.js";
let loader, metaURL, schemaURL, sideBar;
function showDashBoard() {
    let jwtToken = checkToken("jwtToken");
    let url = "https://metatags-generator.fastgenapp.com/get-site-info";
    loader = document.querySelector("[wrapper='loader-dark']");
    loader?.classList.remove("hide-wrapper");
    let options = {
        "method": "POST",
        "content-type": "application/json",
        "body": JSON.stringify({
            "token": jwtToken,
        })
    }

    if (jwtToken == null) {
        window.location.assign("/")
    }

    fetchApiData(url, options)
        .then(async (data) => {
            if (data.ok) {
                let checkSites = data?.siteData.Data;
                if (checkSites?.length > 0) {
                    showSites(checkSites)
                }
            }
            else {
                let errorData = await data.json();
                showNoSitesFound(errorData);
            }

        })
        .catch(async (error) => {
            console.error("API Error:", error);
            // Show error.
            let errorData = await error.json();
            showNoSitesFound(errorData);
        });
}

function showSites(sitesArray) {
    let parentWrapper = document.querySelector("[wrapper='site-info']").parentElement;
    let siteInfoWrapper = document.querySelector("[wrapper='site-info']");
    sideBar = document.querySelector("[wrapper='side-bar']");
    metaURL = sideBar?.querySelector("[add='meta-url']");
    schemaURL = sideBar?.querySelector("[add-schema='url']");
    loader?.classList.add("hide-wrapper");
    let name, image, showMetaBtn, showSchemaBtn, showMissingSchema, showMissingMeta;
    if (siteInfoWrapper != undefined) {
        sitesArray.forEach((site, index) => {
            let { displayName, previewUrl, id, customDomains, shortName, metaTagsCount, schemaCount } = site.Data;
            if (index == 0) {
                let currentMetaUrl = metaURL.getAttribute("href");
                let currentSchemaUrl = schemaURL.getAttribute("href");
                if (customDomains.length > 0) {
                    metaURL.setAttribute("href", currentMetaUrl + `?siteId=${id}&url=${customDomains[0].url}&name=${displayName}`);
                    schemaURL.setAttribute("href", currentSchemaUrl + `?siteId=${id}&url=${customDomains[0].url}&name=${displayName}`);
                }
                else {
                    metaURL.setAttribute("href", currentMetaUrl + `?siteId=${id}&url=${shortName}.webflow.io&name=${displayName}`);
                    schemaURL.setAttribute("href", currentSchemaUrl + `?siteId=${id}&url=${shortName}.webflow.io&name=${displayName}`);
                }
            }
            let clonedWrapper = siteInfoWrapper.cloneNode(true);
            name = clonedWrapper.querySelector("[show-data='name']");
            image = clonedWrapper.querySelector("[show-data='img']");
            showSchemaBtn = clonedWrapper.querySelector("[show-data='pages-schema']");
            showMetaBtn = clonedWrapper.querySelector("[show-data='pages-meta']");
            showMissingMeta = clonedWrapper.querySelector("[show-missing='meta']");
            showMissingSchema = clonedWrapper.querySelector("[show-missing='schema']");
            name.textContent = displayName;
            image.setAttribute("src", previewUrl);
            showMissingMeta.textContent = metaTagsCount;
            showMissingSchema.textContent = schemaCount;
            let currentMetaUrl = showMetaBtn.getAttribute("href");
            let currentSchemaUrl = showSchemaBtn.getAttribute("href");
            if (customDomains.length > 0) {
                showMetaBtn.setAttribute("href", currentMetaUrl + `?siteId=${id}&url=${customDomains[0].url}&name=${displayName}`);
                showSchemaBtn.setAttribute("href", currentSchemaUrl + `?siteId=${id}&url=${customDomains[0].url}&name=${displayName}`);
            } else {
                showMetaBtn.setAttribute("href", currentMetaUrl + `?siteId=${id}&url=${shortName}.webflow.io&name=${displayName}`);
                showSchemaBtn.setAttribute("href", currentSchemaUrl + `?siteId=${id}&url=${shortName}.webflow.io&name=${displayName}`);
            }
            clonedWrapper.classList.remove("hide-wrapper");

            parentWrapper.appendChild(clonedWrapper);
        })
    }
}

function showNoSitesFound() {
    let noSitesFoundWrapper = document.querySelector("[wrapper='no-sites']");
    noSitesFoundWrapper?.classList.remove("hide-wrapper");
    loader.classList.add("hide-wrapper");
}
showDashBoard();
addLogout();
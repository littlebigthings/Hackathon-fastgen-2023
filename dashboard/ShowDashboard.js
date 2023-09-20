import checkToken from "../loginSignup/CheckToken.js";
import fetchApiData from "../loginSignup/APIcall.js";
import addLogout from "./logout.js";
let loader;
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

    if(jwtToken == null){
        window.location.assign("/")
    }
    
    fetchApiData(url, options)
        .then(async (data) => {
            // console.log("API Data:", await data.json());
            let checkSites = data?.siteData;
            if (checkSites?.length > 0) {
                showSites(checkSites)
            }
            else{
                let checkError = await data.json();
                showNoSitesFound(checkError);
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
    loader?.classList.add("hide-wrapper");
    let name, image, showMetaBtn, showSchemaBtn, showMissingSchema, showMissingMeta;
    if (siteInfoWrapper != undefined) {
        sitesArray.forEach(site => {
            let { displayName, previewUrl, id, customDomains, shortName, metaTagsCount, schemaCount} = site.Data;
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
            if (customDomains.length > 0) {
                showSchemaBtn.setAttribute("href", `/site-pages-schema?siteId=${id}&url=${customDomains[0].url}`);
                showMetaBtn.setAttribute("href", `/site-pages-meta?siteId=${id}&url=${customDomains[0].url}`);
            } else {
                showSchemaBtn.setAttribute("href", `/site-pages-schema?siteId=${id}&url=${shortName}.webflow.io`);
                showMetaBtn.setAttribute("href", `/site-pages-meta?siteId=${id}&url=${shortName}.webflow.io`);
            }
            clonedWrapper.classList.remove("hide-wrapper");

            parentWrapper.appendChild(clonedWrapper);
        })
    }
}

function showNoSitesFound(){
    let noSitesFoundWrapper = document.querySelector("[wrapper='no-sites']");
    noSitesFoundWrapper?.classList.remove("hide-wrapper");
    loader.classList.add("hide-wrapper");
}
showDashBoard();
addLogout();
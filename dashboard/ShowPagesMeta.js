// https://metatags-generator.fastgenapp.com/get-pages ->siteId, url, jwtToken

import fetchApiData from "../loginSignup/APIcall.js";
import checkToken from "../loginSignup/CheckToken.js";
import showError from "../loginSignup/ShowError.js";

function loadPages() {
    let pageURl = new URL(document.location);
    let siteId = pageURl?.searchParams.get("siteId");
    let siteUrl = pageURl?.searchParams.get("url");
    let jwtToken = checkToken("jwtToken");

    let url = "https://metatags-generator.fastgenapp.com/get-pages";
    let options = {
        "method": "POST",
        "content-type": "application/json",
        "body": JSON.stringify({
            "token": jwtToken,
            "siteId": siteId,
            "baseUrl": siteUrl
        })
    }
    fetchApiData(url, options)
        .then((data) => {
            // console.log("API Data:", data);
            let pagesData = data.pagesData?.Data?.pageUrls;
            if (pagesData) {
                pagesData.reverse();
                showPages(pagesData);
            }

        })
        .catch((error) => {
            console.error("API Error:", error);
            // Show error.
        });
}

function showPages(pagesData) {
    let metaWrapperToClone = document.querySelector("[meta-wrapper='to-clone']");
    let metaWrapperToInject = document.querySelector("[meta-wrapper='inject']");
    let clonedMetaWrapper, pageNumber, pageName, metaTitleText, metaDescriptionText, generateNewBtn, metaInitialInfoWrapper, metaGeneratedInfoWrapper;
    if (pagesData?.length > 0) {
        pagesData.forEach((page, index) => {
            let { metaDescription, metaTitle, name, pageUrl } = page;
            if (metaTitle == undefined && metaDescription == undefined && name == undefined && pageUrl == undefined) return;
            clonedMetaWrapper = metaWrapperToClone.cloneNode(true);
            metaInitialInfoWrapper = clonedMetaWrapper?.querySelector("[meta-wrapper='initial']");
            metaGeneratedInfoWrapper = clonedMetaWrapper?.querySelector("[meta-wrapper='generated']");
            pageNumber = clonedMetaWrapper?.querySelector("[meta='number']");
            pageName = clonedMetaWrapper?.querySelector("[meta='name']");
            metaTitleText = clonedMetaWrapper?.querySelectorAll("[meta='title']");
            metaDescriptionText = clonedMetaWrapper?.querySelectorAll("[meta='description']");
            generateNewBtn = clonedMetaWrapper?.querySelector("[meta='generate']");

            pageNumber.textContent = index;
            pageName.textContent = name;
            generateNewBtn.setAttribute("page-url", `https://${pageUrl}`);
            if (metaTitleText?.length > 0) {
                metaTitleText.forEach(title => {
                    if (metaTitle != null) {
                        title.textContent = metaTitle;
                    } else {
                        title.textContent = "No data";
                    }
                })
            }
            if (metaDescriptionText?.length > 0) {
                metaDescriptionText.forEach(description => {
                    if (metaDescription != null) {
                        description.textContent = metaDescription;
                    } else {
                        description.textContent = "No data";
                    }
                })
            }
            //  generateNew meta data function call
            addGenerateListener(generateNewBtn, metaGeneratedInfoWrapper);
            metaInitialInfoWrapper.classList.remove("hide-wrapper");
            metaWrapperToInject.appendChild(clonedMetaWrapper);
        });
        metaWrapperToClone.remove();
    }
}

function addGenerateListener(generateNewBtn, wrapper) {
    let generateBtn = generateNewBtn;
    let wrapperToshow = wrapper;
    let generatedTitleToShow = wrapperToshow?.querySelector("[meta='generated-title']");
    let generatedDescriptionToShow = wrapperToshow?.querySelector("[meta='generated-description']");

    generateBtn.addEventListener("click",async (evt)=>{
        let clickedOn = evt.currentTarget;
        let selectedPage = clickedOn?.getAttribute("page-url");
        console.log(selectedPage);
        let pageMetaData = await loadPageNewMeta(selectedPage);
        let dataJson = JSON.parse(pageMetaData);
        console.log(dataJson)
        generatedTitleToShow.textContent = dataJson?.metaTitle;
        generatedDescriptionToShow.textContent = dataJson?.metaDescription;
        wrapperToshow.classList.remove("hide-wrapper");
    })
}

async function loadPageNewMeta(pageurl) {

    let url = "https://metatags-generator.fastgenapp.com/get-meta-tags";
    let options = {
        "method": "POST",
        "content-type": "application/json",
        "body": JSON.stringify({
            "pageUrl": pageurl
        })
    }
    return await fetchApiData(url, options)
        .then((data) => {
            // console.log("API Data:", data);
            return data?.metaTags?.Content;

        })
        .catch((error) => {
            console.error("API Error:", error);
            // Show error.
        });

}


loadPages();
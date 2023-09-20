// https://metatags-generator.fastgenapp.com/get-pages ->siteId, url, jwtToken

import fetchApiData from "../loginSignup/APIcall.js";
import checkToken from "../loginSignup/CheckToken.js";
import addLogout from "./logout.js";
// import showError from "../loginSignup/ShowError.js";

function loadPages() {
    let darkLoader = document.querySelector("[wrapper=loader-dark]");
    let pageURl = new URL(document.location);
    let siteId = pageURl?.searchParams.get("siteId");
    let siteUrl = pageURl?.searchParams.get("url");
    let siteName = pageURl?.searchParams.get("name");
    let sideBar = document.querySelector("[wrapper='side-bar']");
    let metaURL = sideBar?.querySelector("[add='meta-url']");
    let schemaURL = sideBar?.querySelector("[add-schema='url']");
    let missingSchemaWrapper = document.querySelector("[wrapper='missing-schema']");
    let projectName = document.querySelector("[project='name']");
    let missingSchemaToRedirect = missingSchemaWrapper?.querySelector("[add='schema-url']");


    if (siteId == null || siteUrl == null) {
        window.location.assign("/dashboard")
    }
    else {
        let currentMetaUrl = metaURL.getAttribute("href");
        let currentSchemaUrl = schemaURL.getAttribute("href");
        metaURL.setAttribute("href", currentMetaUrl + `?siteId=${siteId}&url=${siteUrl}`);
        schemaURL.setAttribute("href", currentSchemaUrl + `?siteId=${siteId}&url=${siteUrl}`);
        missingSchemaToRedirect.setAttribute("href", currentSchemaUrl + `?siteId=${siteId}&url=${siteUrl}`);
        projectName.textContent = siteName;


        let jwtToken = checkToken("jwtToken");
        if (jwtToken == null) {
            window.location.assign("/")
        }

        darkLoader.classList.remove("hide-wrapper")

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
                // console.log(pagesData)
                if (pagesData) {
                    pagesData.reverse();
                    showPages(pagesData);
                    darkLoader.classList.add("hide-wrapper")
                }

            })
            .catch((error) => {
                console.error("API Error:", error);
                // Show error.
            });
    }
}

function showPages(pagesData) {
    let metaWrapperToClone = document.querySelector("[meta-wrapper='to-clone']");
    let metaWrapperToInject = document.querySelector("[meta-wrapper='inject']");
    let loader = document.querySelector("[wrapper='loader']");
    let allPagesElement = document.querySelector("[show-total='pages']");
    let allPagesMissing = document.querySelector("[show-total='missing-meta']");
    let missingSchemaWrapper = document.querySelector("[wrapper='missing-schema']");
    let missingSchemaText = missingSchemaWrapper?.querySelector("[show-total='missing-schema']");

    let clonedMetaWrapper, pageNumber, pageName, metaTitleText, metaDescriptionText, generateNewBtn, metaInitialInfoWrapper, clonedLoader, metaGeneratedInfoWrapper, btnText, spanElement, closeBtn, sameMetaTitleTick, sameMetaDescriptionTick, dropdown;
    if (pagesData?.length > 0) {
        let currentMissingMetaCount = 0;
        let currentMissingSchemaCount = 0;
        allPagesElement.textContent = pagesData.length-1;
        pagesData.forEach((page, index) => {
            let { metaDescription, metaTitle, name, pageUrl, ogSameDescription, ogSameTitle, seoSchema } = page;
            if (metaTitle == undefined && metaDescription == undefined && name == undefined && pageUrl == undefined) return;

            if (metaDescription == null) {
                currentMissingMetaCount = currentMissingMetaCount + 1;
            }
            if (metaTitle == null) {
                currentMissingMetaCount = currentMissingMetaCount + 1;
            }

            if(Object.keys(seoSchema).length==0){
                currentMissingSchemaCount = currentMissingSchemaCount +1;
            }
            clonedMetaWrapper = metaWrapperToClone.cloneNode(true);
            clonedLoader = loader.cloneNode(true);
            clonedLoader.classList.add("hide-wrapper");

            metaInitialInfoWrapper = clonedMetaWrapper?.querySelector("[meta-wrapper='initial']");
            metaGeneratedInfoWrapper = clonedMetaWrapper?.querySelector("[meta-wrapper='generated']");
            pageNumber = clonedMetaWrapper?.querySelector("[meta='number']");
            pageName = clonedMetaWrapper?.querySelector("[meta='name']");
            metaTitleText = clonedMetaWrapper?.querySelectorAll("[meta='title']");
            metaDescriptionText = clonedMetaWrapper?.querySelectorAll("[meta='description']");
            sameMetaTitleTick = metaInitialInfoWrapper?.querySelector("[meta='title-same']");
            sameMetaDescriptionTick = metaInitialInfoWrapper?.querySelector("[meta='description-same']");
            dropdown = metaInitialInfoWrapper?.querySelector("[btn-type-='open-result']");

            generateNewBtn = clonedMetaWrapper?.querySelector("[meta='generate']");
            spanElement = document.createElement("span");
            btnText = generateNewBtn.textContent;
            generateNewBtn.textContent = "";
            spanElement.textContent = btnText;
            generateNewBtn.appendChild(spanElement);
            generateNewBtn.appendChild(clonedLoader);
            generateNewBtn.setAttribute("regenerate", false);

            closeBtn = clonedMetaWrapper?.querySelector("[meta='close']");

            pageNumber.textContent = index;
            pageName.textContent = name;

            ogSameTitle ? sameMetaTitleTick.style.display = "block" : sameMetaTitleTick.style.display = "none";
            ogSameDescription ? sameMetaDescriptionTick.style.display = "block" : sameMetaDescriptionTick.style.display = "none";
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
            addGenerateListener(generateNewBtn, metaGeneratedInfoWrapper, clonedLoader, spanElement, closeBtn, dropdown);
            metaInitialInfoWrapper.classList.remove("hide-wrapper");
            metaWrapperToInject.appendChild(clonedMetaWrapper);
        });
        allPagesMissing.textContent = currentMissingMetaCount;
        missingSchemaText.textContent = currentMissingSchemaCount;
        metaWrapperToClone.remove();
        generateAllListener();
    }
}

function generateAllListener(){
    let generateAll = document.querySelector("[generate='all']");
    generateAll?.addEventListener("click",()=>{
        let allgenerateCta = document.querySelectorAll("[meta='generate']");
        allgenerateCta.forEach(cta => {
            cta.click();
        });
    })
}

function addGenerateListener(generateNewBtn, wrapper, loader, spanElement, closeBtn, dropdown) {
    let generateBtn = generateNewBtn;
    let wrapperToshow = wrapper;
    let loaderWrapper = loader;
    let btnText = spanElement;
    let closeCta = closeBtn;
    let openResult = dropdown;
    let generatedTitleToShow = wrapperToshow?.querySelector("[meta='generated-title']");
    let generatedDescriptionToShow = wrapperToshow?.querySelector("[meta='generated-description']");
    let copyTitleBtn = wrapperToshow?.querySelector("[copy='title']");
    let copyDescriptionBtn = wrapperToshow?.querySelector("[copy='description']");

    generateBtn.addEventListener("click", async (evt) => {
        loaderWrapper.classList.remove("hide-wrapper");
        btnText.style.display = "none";
        let clickedOn = evt.currentTarget;
        let selectedPage = clickedOn?.getAttribute("page-url");
        let regenerate = clickedOn?.getAttribute("regenerate");
        console.log(selectedPage);
        let pageMetaData = await loadPageNewMeta({ selectedPage, regenerate });
        console.log(pageMetaData)
        if (pageMetaData?.error) {
            console.log(pageMetaData.error)
        }
        else if (pageMetaData?.metaTags?.Content) {
            let { Content } = pageMetaData?.metaTags;
            let dataJson = JSON.parse(Content);
            let { metaTitle, metaDescription } = dataJson;
            generatedTitleToShow.textContent = metaTitle;
            generatedDescriptionToShow.textContent = metaDescription;
            btnText.style.display = "inline-block";
            loaderWrapper.classList.add("hide-wrapper");
            wrapperToshow.classList.remove("hide-wrapper");
            btnText.textContent = "Regenerate";
            copyTitleBtn.setAttribute("data-clipboard-text", metaTitle);
            copyDescriptionBtn.setAttribute("data-clipboard-text", metaDescription);
            clickedOn.setAttribute("regenerate", true);
        }
    })
    // add copyListener
    addCopyListener(copyTitleBtn);
    addCopyListener(copyDescriptionBtn);

    closeCta.addEventListener("click", () => {
        // wrapperToshow.classList.add("hide-wrapper");
        openResult.click();
    })
    openResult.addEventListener("click", (evt) => {
        // console.log("clck")
        let currentBtn = evt.currentTarget
        let isopen = currentBtn.getAttribute("is-open");
        let arrowImage = currentBtn.querySelector("img");
        // console.log(isopen)
        if (isopen == "true") {
            wrapperToshow.classList.add("hide-wrapper");
            arrowImage.classList.remove("up");
            currentBtn.setAttribute("is-open", false);
        } else {
            wrapperToshow.classList.remove("hide-wrapper");
            arrowImage.classList.add("up");
            currentBtn.setAttribute("is-open", true);
        }
    })
}

function addCopyListener(copyBtn) {
    let cta = copyBtn;
    let clipboard = new ClipboardJS(cta);
}

async function loadPageNewMeta(pageData) {

    let url = "https://metatags-generator.fastgenapp.com/get-meta-tags";
    let options = {
        "method": "POST",
        "content-type": "application/json",
        "body": JSON.stringify({
            "pageUrl": pageData.selectedPage,
            "regenerate": pageData.regenerate
        })
    }
    return await fetchApiData(url, options)
        .then((data) => {
            // console.log("API Data:", data);
            return data;

        })
        .catch((error) => {
            return error;
            console.error("API Error:", error);
            // Show error.
        });

}


loadPages();
addLogout();
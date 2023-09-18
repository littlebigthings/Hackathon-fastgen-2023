// https://metatags-generator.fastgenapp.com/get-pages ->siteId, url, jwtToken
import fetchApiData from "../loginSignup/APIcall.js";
import checkToken from "../loginSignup/CheckToken.js";
import showError from "../loginSignup/ShowError.js";

function loadPages() {
    let darkLoader = document.querySelector("[wrapper=loader-dark]");
    let pageURl = new URL(document.location);
    let siteId = pageURl?.searchParams.get("siteId");
    let siteUrl = pageURl?.searchParams.get("url");
    let jwtToken = checkToken("jwtToken");
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
            console.log("API Data:", data);
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

function showPages(pagesData) {
    let metaWrapperToClone = document.querySelector("[meta-wrapper='to-clone']");
    let metaWrapperToInject = document.querySelector("[meta-wrapper='inject']");
    let loader = document.querySelector("[wrapper='loader']");
    let clonedMetaWrapper, pageNumber, pageName, currentSchemaElement, generateNewBtn, metaInitialInfoWrapper, clonedLoader, metaGeneratedInfoWrapper, btnText, spanElement, closeBtn;
    if (pagesData?.length > 0) {
        pagesData.forEach((page, index) => {
            let { name, pageUrl, seoSchema } = page;
            if (name == undefined && pageUrl == undefined) return;
            clonedMetaWrapper = metaWrapperToClone.cloneNode(true);
            clonedLoader = loader.cloneNode(true);
            clonedLoader.classList.add("hide-wrapper");

            metaInitialInfoWrapper = clonedMetaWrapper?.querySelector("[meta-wrapper='initial']");
            metaGeneratedInfoWrapper = clonedMetaWrapper?.querySelector("[meta-wrapper='generated']");
            currentSchemaElement = clonedMetaWrapper?.querySelectorAll("[schema='current']");
            pageNumber = clonedMetaWrapper?.querySelector("[meta='number']");
            pageName = clonedMetaWrapper?.querySelector("[meta='name']");


            if (seoSchema?.seoSchema) {
                // console.log(seoSchema)
                let parsedString = JSON.stringify(seoSchema.seoSchema, null, 2);
                currentSchemaElement.forEach(item => {
                    let preText = document.createElement("pre");
                    preText.textContent = parsedString
                    item.appendChild(preText);
                })
            }
            generateNewBtn = clonedMetaWrapper?.querySelector("[meta='generate']");
            spanElement = document.createElement("span");
            btnText = generateNewBtn.textContent;
            generateNewBtn.textContent = "";
            spanElement.textContent = btnText;
            generateNewBtn.appendChild(spanElement);
            generateNewBtn.appendChild(clonedLoader);

            closeBtn = clonedMetaWrapper?.querySelector("[meta='close']");

            pageNumber.textContent = index;
            pageName.textContent = name;
            generateNewBtn.setAttribute("page-url", `https://${pageUrl}`);
            generateNewBtn.setAttribute("regenerate", false);

            //  generateNew meta data function call
            addGenerateListener(generateNewBtn, metaGeneratedInfoWrapper, clonedLoader, spanElement, closeBtn);
            metaInitialInfoWrapper.classList.remove("hide-wrapper");
            metaWrapperToInject.appendChild(clonedMetaWrapper);
        });
        metaWrapperToClone.remove();
    }
}

function addGenerateListener(generateNewBtn, wrapper, loader, spanElement, closeBtn) {
    let generateBtn = generateNewBtn;
    let wrapperToshow = wrapper;
    let loaderWrapper = loader;
    let btnText = spanElement;
    let closeCta = closeBtn;
    let generatedSchemaToShow = wrapperToshow?.querySelector("[schema='generated']");

    generateBtn.addEventListener("click", async (evt) => {
        generatedSchemaToShow.innerHTML = "";
        loaderWrapper.classList.remove("hide-wrapper");
        btnText.style.display = "none";
        let clickedOn = evt.currentTarget;
        let selectedPage = clickedOn?.getAttribute("page-url");
        let regenerate = clickedOn?.getAttribute("regenerate");
        // console.log(selectedPage);
        let pageMetaData = await loadPageNewSchema({ selectedPage, regenerate });
        let codeElement = document.createElement("pre");
        if (pageMetaData?.seoSchema?.Content) {
            let { Content } = pageMetaData?.seoSchema;
            let jsonFormat = JSON.parse(Content)
            let stringSchema = JSON.stringify(jsonFormat.seoSchema, null, 2)

            codeElement.textContent = stringSchema;
            generatedSchemaToShow.appendChild(codeElement);
            btnText.style.display = "inline-block";
            loaderWrapper.classList.add("hide-wrapper");
            wrapperToshow.classList.remove("hide-wrapper");
            clickedOn.setAttribute("regenerate", true);
            btnText.textContent = "Regenerate";
        }
        else if (pageMetaData?.error) {
            console.log(pageMetaData.error)
        }
    })
    closeCta.addEventListener("click", () => {
        wrapperToshow.classList.add("hide-wrapper");
    })
}

async function loadPageNewSchema(schemaOptions) {

    let url = "https://metatags-generator.fastgenapp.com/get-schema";
    let options = {
        "method": "POST",
        "content-type": "application/json",
        "body": JSON.stringify({
            "pageUrl": schemaOptions.selectedPage,
            "regenerate": schemaOptions.regenerate
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
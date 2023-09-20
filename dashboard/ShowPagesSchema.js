// https://metatags-generator.fastgenapp.com/get-pages ->siteId, url, jwtToken
import fetchApiData from "../loginSignup/APIcall.js";
import checkToken from "../loginSignup/CheckToken.js";
import generateBetterSchema from "./GenerateBetterSchema.js";
import addLogout from "./logout.js";
// import showError from "../loginSignup/ShowError.js";

function loadPages() {
    let darkLoader = document.querySelector("[wrapper=loader-dark]");
    let pageURl = new URL(document.location);
    let siteId = pageURl?.searchParams.get("siteId");
    let siteUrl = pageURl?.searchParams.get("url");
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
            console.log("API Data:", data);
            let pagesData = data.pagesData?.Data?.pageUrls;
            // console.log(pagesData)
            if (pagesData) {
                pagesData.reverse();
                showPages(pagesData);
                darkLoader.classList.add("hide-wrapper")
            }

        })
    // .catch((error) => {
    //     console.error("API Error:", error);
    //     // Show error.
    // });
}

function showPages(pagesData) {
    let metaWrapperToClone = document.querySelector("[meta-wrapper='to-clone']");
    let metaWrapperToInject = document.querySelector("[meta-wrapper='inject']");
    let loader = document.querySelector("[wrapper='loader']");
    let popupWrapper = document.querySelector("[wrapper='popup']");
    let clonedMetaWrapper, pageNumber, pageName, currentSchemaElement, generateNewBtn, metaInitialInfoWrapper, clonedLoader, clonedLoaderSpecific, metaGeneratedInfoWrapper, btnText, spanElement, closeBtn, specificGenerateNewBtn, spanElementTwo;

    if (pagesData?.length > 0) {
        pagesData.forEach((page, index) => {
            let { name, pageUrl, seoSchema } = page;

            if (name == undefined && pageUrl == undefined) return;
            clonedMetaWrapper = metaWrapperToClone.cloneNode(true);
            clonedLoader = loader.cloneNode(true);
            clonedLoader.classList.add("hide-wrapper");

            clonedLoaderSpecific = loader.cloneNode(true);
            clonedLoaderSpecific.classList.add("hide-wrapper");

            metaInitialInfoWrapper = clonedMetaWrapper?.querySelector("[meta-wrapper='initial']");
            metaGeneratedInfoWrapper = clonedMetaWrapper?.querySelector("[meta-wrapper='generated']");
            currentSchemaElement = clonedMetaWrapper?.querySelectorAll("[schema='current']");
            pageNumber = clonedMetaWrapper?.querySelector("[meta='number']");
            pageName = clonedMetaWrapper?.querySelector("[meta='name']");
            generateNewBtn = clonedMetaWrapper?.querySelector("[meta='generate']");
            specificGenerateNewBtn = clonedMetaWrapper?.querySelector("[meta='specific-generate']");


            if (seoSchema?.seoSchema) {
                // console.log(seoSchema)
                let parsedString = JSON.stringify(seoSchema.seoSchema, null, 2);
                currentSchemaElement.forEach(item => {
                    let preText = document.createElement("pre");
                    preText.textContent = parsedString
                    item.appendChild(preText);
                })
            }
            spanElement = document.createElement("span");
            spanElementTwo = document.createElement("span");
            // For schema new generate btn
            btnText = generateNewBtn.textContent;
            generateNewBtn.textContent = "";
            spanElement.textContent = btnText;
            generateNewBtn.appendChild(spanElement);
            generateNewBtn.appendChild(clonedLoader);
            // For specific schema generate btn
            btnText = specificGenerateNewBtn.textContent;
            specificGenerateNewBtn.textContent = "";
            spanElementTwo.textContent = btnText;
            specificGenerateNewBtn.appendChild(spanElementTwo);
            specificGenerateNewBtn.appendChild(clonedLoaderSpecific);

            closeBtn = clonedMetaWrapper?.querySelector("[meta='close']");

            pageNumber.textContent = index;
            pageName.textContent = name;
            generateNewBtn.setAttribute("page-url", `https://${pageUrl}`);
            specificGenerateNewBtn.setAttribute("page-url", `https://${pageUrl}`);
            generateNewBtn.setAttribute("regenerate", false);

            //  generateNew meta data function call
            addGenerateListener(generateNewBtn, metaGeneratedInfoWrapper, clonedLoader, spanElement, closeBtn, popupWrapper, specificGenerateNewBtn);
            // generateBetterSchema({specificGenerateNewBtn, metaGeneratedInfoWrapper, clonedLoaderSpecific, spanElementTwo, clonedMetaWrapper, pageUrl});
            metaInitialInfoWrapper.classList.remove("hide-wrapper");
            metaWrapperToInject.appendChild(clonedMetaWrapper);
        });
        metaWrapperToClone.remove();
    }
}


function addGenerateListener(generateNewBtn, wrapper, loader, spanElement, closeBtn, popupQuestionWrapper, specificGenerateNewBtn) {
    let generateBtn = generateNewBtn;
    let wrapperToshow = wrapper;
    let loaderWrapper = loader;
    let btnText = spanElement;
    let closeCta = closeBtn;
    let generatedSchemaToShow = wrapperToshow?.querySelector("[schema='generated']");
    let popupWrapper = popupQuestionWrapper;
    let triggerPopCta = specificGenerateNewBtn;
    let popupForm = popupWrapper?.querySelector("[questions='form']");
    let inputWrapper = popupForm?.querySelector("[input='wrapper']");
    let formSubmitCta = popupWrapper?.querySelector("[schema='generate']");
    let formLoader = document.querySelector("[wrapper='loader']").cloneNode(true);
    let formBtnText = formSubmitCta.textContent;
    let formSpanElement = document.createElement("span");
   
    formSpanElement.textContent = formBtnText;
    formSubmitCta.textContent = "";
    formSubmitCta.appendChild(formSpanElement);
    formSubmitCta.appendChild(formLoader);

    generateBtn.addEventListener("click", async (evt) => {
        generatedSchemaToShow.innerHTML = "";
        loaderWrapper.classList.remove("hide-wrapper");
        btnText.style.display = "none";

        let clickedOn = evt.currentTarget;
        let selectedPage = clickedOn?.getAttribute("page-url");
        let regenerate = clickedOn?.getAttribute("regenerate");
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
    });

    triggerPopCta?.addEventListener("click", async (evt) => {
        // remove old inputs.
        removeOldInputs();

        let currentCta = evt.currentTarget;
        let pageUrl = currentCta.getAttribute("page-url");
        let loaderWrapper = currentCta.querySelector("[wrapper='loader']");
        let btnText = currentCta.querySelector("span");

        currentCta.style.pointerEvents = "none";
        loaderWrapper.classList.remove("hide-wrapper");
        btnText.style.display = "none";

        let getQuestionsData = await loadQuestions(pageUrl);
        formSubmitCta.setAttribute("page-url", pageUrl);

        let questionsObj = JSON.parse(getQuestionsData.suggestions.Content);

        btnText.style.display = "inline-block";
        loaderWrapper.classList.add("hide-wrapper");

        if (questionsObj?.questions?.length > 0) {
            questionsObj.questions.forEach(question => {
                let clonedWrapper = inputWrapper.cloneNode(true);
                let label = clonedWrapper?.querySelector("[item='question']");
                label.textContent = question;
                clonedWrapper.classList.remove("hide-wrapper");
                inputWrapper.insertAdjacentElement("afterend", clonedWrapper);

            })
            popupWrapper.classList.remove("hide-wrapper");

            currentCta.style.pointerEvents = "auto";
            loaderWrapper.classList.add("hide-wrapper");
            btnText.style.display = "inline-block";

        }
        // questionForm.classList.remove("hide-wrapper");

    })

    formSubmitCta.addEventListener("click", async (evt) => {
        let details = {};
        let currentBtn = evt.currentTarget;
        let pageUrl = currentBtn?.getAttribute("page-url");
        let currentForm = currentBtn.parentElement;
        let allInputWrapper = currentForm.querySelectorAll("[input='wrapper']");
        let loaderWrapper = currentBtn.querySelector("[wrapper='loader']");
        let btnText = currentBtn.querySelector("span");

        currentBtn.style.pointerEvents = "none";
        loaderWrapper.classList.remove("hide-wrapper");
        btnText.style.display = "none";

        allInputWrapper.forEach(wrapper => {
            let question = wrapper.querySelector("[item='question']").textContent;
            let answer = wrapper.querySelector("[item='answer']").value;
            details = {
                [question]: answer,
                ...details

            }

        })
        let pageMetaData = await loadBetterSchema({ details, pageUrl })
        let codeElement = document.createElement("pre");

        if (pageMetaData?.seoSchema?.Content) {
            let { Content } = pageMetaData?.seoSchema;
            let jsonFormat = JSON.parse(Content)
            let stringSchema = JSON.stringify(jsonFormat.seoSchema, null, 2)

            codeElement.textContent = stringSchema;
            generatedSchemaToShow.appendChild(codeElement);

            currentBtn.style.pointerEvents = "auto";
            btnText.style.display = "inline-block";
            loaderWrapper.classList.add("hide-wrapper");

            loaderWrapper.classList.add("hide-wrapper");
            wrapperToshow.classList.remove("hide-wrapper");
            popupWrapper.classList.add("hide-wrapper");

        }
        else if (pageMetaData?.error) {
            console.log(pageMetaData.error)
        }
    })

    popupForm.addEventListener("submit", (evt) => {
        evt.preventDefault();
        evt.stopImmediatePropogation();
    })


    closeCta.addEventListener("click", () => {
        wrapperToshow.classList.add("hide-wrapper");
    })
}

function removeOldInputs() {

    let formWrapper = document.querySelector("[meta-wrapper='specific']")
    let allOldInputs = formWrapper?.querySelectorAll("[input='wrapper']");

    if (allOldInputs?.length > 0) {
        allOldInputs.forEach((input, index) => {
            if (index == 0) return;
            input.remove();
        })
    }

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

async function loadBetterSchema(schemaOptions) {

    let url = "https://metatags-generator.fastgenapp.com/get-schema";
    let options = {
        "method": "POST",
        "content-type": "application/json",
        "body": JSON.stringify({
            "pageUrl": schemaOptions.pageUrl,
            "details": schemaOptions.details
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


function loadQuestions(pageUrl) {
    let jwtToken = checkToken("jwtToken");

    if (jwtToken == null) {
        window.location.assign("/")
    }

    let url = "https://metatags-generator.fastgenapp.com/getting-suggestion";
    let options = {
        "method": "POST",
        "content-type": "application/json",
        "body": JSON.stringify({
            "token": jwtToken,
            "pageUrl": pageUrl,
        })
    }
    let responce = fetchApiData(url, options)
        .then((data) => {
            console.log("API Data:", data);
            return data;

        })
        .catch((error) => {
            console.error("API Error:", error);
            // Show error.
        });
    return responce;
}

loadPages();
addLogout();
import fetchApiData from "../loginSignup/APIcall.js";
import checkToken from "../loginSignup/CheckToken.js";
import addLogout from "./logout.js";

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
        .catch((error) => {
            console.error("API Error:", error);
            // Show error.
        });
}

function showPages(pagesData) {
    let metaWrapperToClone = document.querySelector("[meta-wrapper='to-clone']");
    let metaWrapperToInject = document.querySelector("[meta-wrapper='inject']");
    let loader = document.querySelector("[wrapper='loader']");
    let popupWrapper = document.querySelector("[wrapper='popup']");

    let clonedMetaWrapper, pageNumber, pageName, currentSchemaElement, generateNewBtn, metaInitialInfoWrapper, clonedLoader, clonedLoaderSpecific, metaGeneratedInfoWrapper, btnText, spanElement, closeBtn, specificGenerateNewBtn, dropdown, spanElementTwo;

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
            dropdown = metaInitialInfoWrapper?.querySelector("[btn-type-='open-result']");


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
            addGenerateListener({ generateNewBtn, metaGeneratedInfoWrapper, clonedLoader, spanElement, specificGenerateNewBtn, closeBtn, dropdown, popupWrapper });

            metaInitialInfoWrapper.classList.remove("hide-wrapper");
            metaWrapperToInject.appendChild(clonedMetaWrapper);
        });
        metaWrapperToClone.remove();
        // add form submission listener
        addFormSubmitListener(popupWrapper);
    }
}

function addFormSubmitListener(formElement) {
    let popupWrapper = formElement;
    let formSubmitCta = formElement?.querySelector("[schema='generate']");
    let popupForm = formElement?.querySelector("[questions='form']");
    let formLoader = document.querySelector("[wrapper='loader']").cloneNode(true);
    let formBtnText = formSubmitCta.textContent;
    let formSpanElement = document.createElement("span");
    let mainDataWrapper = document.querySelector("[meta-wrapper='inject']");

    formSpanElement.textContent = formBtnText;
    formSubmitCta.textContent = "";
    formSubmitCta.appendChild(formSpanElement);
    formSubmitCta.appendChild(formLoader);
    // let fo
    formSubmitCta.addEventListener("click", async (evt) => {
        let details = {};
        let currentBtn = evt.currentTarget;
        let pageUrl = currentBtn?.getAttribute("page-url");
        let currentForm = currentBtn.parentElement;
        let allInputWrapper = currentForm.querySelectorAll("[input='wrapper']");
        let loaderWrapper = currentBtn.querySelector("[wrapper='loader']");
        let btnText = currentBtn.querySelector("span");
        let triggerdFromCta = mainDataWrapper?.querySelector(`[page-url='${pageUrl}']`);
        let mainSchemaWrapper = triggerdFromCta?.closest("[meta-wrapper='to-clone']");
        let wrapperToshow = mainSchemaWrapper?.querySelector("[meta-wrapper='generated']");
        let generatedSchemaToShow = mainSchemaWrapper?.querySelector("[schema='generated']");
        let openResultCta = mainDataWrapper?.querySelector("[btn-type-='open-result']");


        allInputWrapper.forEach((wrapper, index) => {
            if (index == 0) return;
            let question = wrapper.querySelector("[item='question']").textContent;
            let answer = wrapper.querySelector("[item='answer']");
            if (answer.value.length > 0) {
                details = {
                    [question]: answer.value,
                    ...details
                }
            } else {
                answer.reportValidity();
            }
        })

        if (Object.keys(details).length == allInputWrapper.length - 1) {
            generatedSchemaToShow.innerHTML = "";
            currentBtn.style.pointerEvents = "none";
            loaderWrapper.classList.remove("hide-wrapper");
            btnText.style.display = "none";
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
                openResultCta.click();

            }
            else if (pageMetaData?.error) {
                console.log(pageMetaData.error)
            }
        }
    })

    popupForm.addEventListener("submit", (evt) => {
        evt.preventDefault();
        evt.stopImmediatePropogation();
    })
}

function addGenerateListener(btnObject) {
    let generateBtn = btnObject.generateNewBtn;
    let wrapperToshow = btnObject.metaGeneratedInfoWrapper;
    let loaderWrapper = btnObject.clonedLoader;
    let btnText = btnObject.spanElement;
    let closeCta = btnObject.closeBtn;
    let openResult = btnObject.dropdown;
    let generatedSchemaToShow = wrapperToshow?.querySelector("[schema='generated']");
    let popupWrapper = btnObject.popupWrapper;
    let triggerPopCta = btnObject.specificGenerateNewBtn;
    let popupForm = popupWrapper?.querySelector("[questions='form']");
    let formSubmitCta = popupWrapper?.querySelector("[schema='generate']");
    let inputWrapper = popupForm?.querySelector("[input='wrapper']");

    // Add first generate listener
    generateBtn.addEventListener("click", async (evt) => {
        generateBtn.style.pointerEvents = "none";
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
            openResult.click();
            // wrapperToshow.classList.remove("hide-wrapper");
            generateBtn.style.pointerEvents = "auto";
            clickedOn.setAttribute("regenerate", true);
            btnText.textContent = "Regenerate";
        }
        else if (pageMetaData?.error) {
            console.log(pageMetaData.error)
        }
    });

    // listener for popup open and add new questions
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

    // close current open card.
    closeCta.addEventListener("click", () => {
        openResult.click();
    });

    // dropdown functionality.
    openResult.addEventListener("click", (evt) => {
        let currentBtn = evt.currentTarget
        let isopen = currentBtn.getAttribute("is-open");
        let arrowImage = currentBtn.querySelector("img");
        if (isopen == "true") {
            wrapperToshow.classList.add("hide-wrapper");
            arrowImage.classList.remove("up");
            currentBtn.setAttribute("is-open", false);
        } else {
            wrapperToshow.classList.remove("hide-wrapper");
            arrowImage.classList.add("up");
            currentBtn.setAttribute("is-open", true);
        }
    });
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
            "details": schemaOptions.details,
            "regenerate": "true",
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
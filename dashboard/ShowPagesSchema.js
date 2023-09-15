// https://metatags-generator.fastgenapp.com/get-pages ->siteId, url, jwtToken

import fetchApiData from "../loginSignup/APIcall.js";
import checkToken from "../loginSignup/CheckToken.js";

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
            let pagesData = data.pagesData?.Data;
            console.log(pagesData)
            if (pagesData) showPages(pagesData);

        })
        .catch((error) => {
            console.error("API Error:", error);
            // Show error.
        });
}

function showPages(pagesData) {
    let { Response, pageUrls } = pagesData;
    let { pages } = Response;
    let row = document.querySelector("[table='row']");
    let rowParent = document.querySelector("[table='row']").parentElement;

    if (pages?.length > 0) {
        let clonedRow, pageNumber, pageName, hasSchema, showSchema, generateSchema, publish;
        pages.forEach((page, index) => {
            clonedRow = row.cloneNode(true);
            pageNumber = clonedRow?.querySelector("[data-show='number']");
            pageName = clonedRow?.querySelector("[data-show='page-name']");
            hasSchema = clonedRow?.querySelector("[data-show='has-schema']");
            showSchema = clonedRow?.querySelector("[data-show='show-schema']");
            generateSchema = clonedRow?.querySelector("[data-generate='schema']");
            publish = clonedRow?.querySelector("[data-perform='publish']");

            pageNumber.textContent = index;
            pageName.textContent = page.title;
            generateSchema.setAttribute("page-url", pageUrls[index]);
            rowParent.appendChild(clonedRow);
            addCtaListener(generateSchema, clonedRow);
        });
    }
}

function addCtaListener(cta, parent) {
    cta?.addEventListener("click", async (evt) => {
        let pageurl = evt.currentTarget?.getAttribute("page-url");
        let schemaData = await loadSchema(pageurl);
        let parsedSchema = JSON.parse(schemaData);
        showSchemaOnPage(parsedSchema, parent);
    })
}

async function loadSchema(pageurl) {

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
            console.log("API Data:", data.tagData.Content);
            return data?.tagData?.Content;

        })
        .catch((error) => {
            console.error("API Error:", error);
            // Show error.
        });

}

function showSchemaOnPage(schema, parent) {
    let checkHasSchema = parent.parentElement.querySelector("[schema-loaded='true']");
    checkHasSchema?.remove();

    let schemaRow = document.createElement("tr");
    schemaRow.setAttribute('schema-loaded','true');

    let cellTitle = document.createElement("td");
    let cellDescription = document.createElement("td");
    let cellSchema = document.createElement("td");

    cellSchema.colSpan = 2;
    cellSchema.textContent = JSON.stringify(schema?.seoSchema);
    
    cellTitle.colSpan = 2;
    cellTitle.textContent = schema?.metaTitle;
    
    cellDescription.colSpan = 2;
    cellDescription.textContent = schema?.metaDescription;
    
    // console.log(schema.metaTitle)
    console.log(cellSchema)
    console.log(cellTitle)
    console.log(cellDescription)

    schemaRow.appendChild(cellTitle);
    schemaRow.appendChild(cellDescription);
    schemaRow.appendChild(cellSchema);
    parent.insertAdjacentElement("afterend", schemaRow);
}

loadPages();
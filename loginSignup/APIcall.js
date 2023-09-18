async function fetchApiData(url, options) {
    return fetch(url, options)
        .then((response) => {
            if (!response.ok) {
                return response;
                // throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            // console.error("Error:", error);
            return error;
            // throw error;
        });
}

export default fetchApiData;
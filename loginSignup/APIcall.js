async function fetchApiData(url, options) {
    return fetch(url, options)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch((error) => {
            console.error("Error:", error);
            throw error;
        });
}

export default fetchApiData;
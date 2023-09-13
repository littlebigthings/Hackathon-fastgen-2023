function checkToken(name) {
   let tokenVal =  window.localStorage.getItem(name);
    return tokenVal;
}

export default checkToken;

// to get the user info
// https://metatags-generator.fastgenapp.com/auth
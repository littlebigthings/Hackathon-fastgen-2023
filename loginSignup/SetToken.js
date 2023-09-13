function setLoginToken(tokenName, tokenVal) {
    window.localStorage.setItem(tokenName, tokenVal);
    return true;
}

export default setLoginToken;
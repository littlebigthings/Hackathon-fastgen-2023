function removeToken(name){
    window.localStorage.removeItem(name);
    return true;
}

export default removeToken;
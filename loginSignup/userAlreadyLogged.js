function checkUserAlreadyLoggedIn(){
    let jwtToken = window.localStorage.getItem("jwtToken");
    if(jwtToken != null){
        window.location.assign("/dashboard");
    }
}

export default checkUserAlreadyLoggedIn;
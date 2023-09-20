function addLogout(){
    let logoutBtn = document.querySelector("[btn-type='logout']");
    logoutBtn?.addEventListener("click",()=>{
        let removeToken = window.localStorage.removeItem("jwtToken");
        removeToken??window.location.assign("/")
    })
}

export default addLogout;
function switchScreens(){
    let openScreensCta = document.querySelectorAll("[show]");
    if(openScreensCta?.length>0){
        openScreensCta.forEach(cta => {
            cta.addEventListener("click",(evt)=>{
                let screenToOpen = evt.currentTarget.getAttribute("show");
                openScreen(screenToOpen);
            })
        })
    }
}

function openScreen(screenToOpen){
    let allScreens = document.querySelectorAll("[screen]");
    if(allScreens?.length>0){
        if(screenToOpen == "signup"){
            let signupBtn = document.querySelector("[tab='signup']");
            signupBtn?.click();
            screenToOpen = "login-signup";
        }
        if(screenToOpen == "login"){
            let loginupBtn = document.querySelector("[tab='login']");
            loginupBtn?.click();
            screenToOpen = "login-signup";
        }
        allScreens.forEach(screen =>{
            let screenType = screen.getAttribute("screen");
            if(screenToOpen == screenType){
                screen.classList.remove("hide-comp");
            }
            else{
                screen.classList.add("hide-comp");
            }
        })
    }
}

export default switchScreens;
export {openScreen};
const constructDocumentForUnregistered = async() => {
    const register = document.createElement("a")
    register.textContent = "Register"
    
    register.addEventListener("click", () => {
        window.location.href = "/register.html"
    })

    document.getElementById("unregistered").appendChild(register);

    const login = document.createElement("a")
    login.textContent = "Login"
    
    login.addEventListener("click", () => {
        window.location.href = "/login.html"
    })

    document.getElementById("unregistered").appendChild(login);

}

const deconstructDocument = async() => {
    document.getElementById("unregistered").innerHTML = ""
    document.getElementById("registered").innerHTML = ""
}

const isRegistered = async() => {
    deconstructDocument();

    const loggedIn = localStorage.getItem("auth_token");

    if (!loggedIn) {
        constructDocumentForUnregistered();
        return;
    }
}

isRegistered();

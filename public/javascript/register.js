//document.addEventListener("DOMContentLoaded", () => {
//})
document.getElementById("formRegister").addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(event.target)
    console.log(data)

    const res = await fetch("/api/user/register", {
        method: "POST",
        body: data
    });

    let err = "";

    switch(res.status) {
        case 200:
            window.location.href = "/login.html";
            return;
            break;
        case 400:
            err = "Bad password";
            break;
        case 403:
            err = "Account with this email already exists";
            break;
        default:
    }

    document.getElementById("registerResult").textContent = "Registeration failed: " + err;
})


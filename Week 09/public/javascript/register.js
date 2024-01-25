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
            err = "Password is not strong enough";
            break;
        case 403:
            err = "Email already in use";
            break;
        default:
    }

    document.getElementById("registerResult").textContent = "Registeration failed: " + err;
})


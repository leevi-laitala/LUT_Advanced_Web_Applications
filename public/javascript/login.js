document.getElementById("formLogin").addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = new FormData(event.target);

    const res = await fetch("/api/user/login", {
        method: "POST",
        body: data
    });

    let err = "";
    
    switch(res.status) {
        case 200:
            const resJson = await res.json();
            if (resJson.token) {
                localStorage.setItem("auth_token", resJson.token);
                window.location.href = "/";
                return;
            }
        default:
            err = "Invalid credentials";
    }

    document.getElementById("loginResult").textContent = "Registeration failed: " + err;
})


const constructDocumentForUnregistered = async() => {
    const register = document.createElement("a")
    register.textContent = "Register"
    register.href = "/register.html"
    
    register.addEventListener("click", () => {
        window.location.href = "/register.html"
    })

    document.getElementById("unregistered").appendChild(register);

    const login = document.createElement("a")
    login.textContent = "Login"
    login.href = "/login.html"
    
    login.addEventListener("click", () => {
        window.location.href = "/login.html"
    })

    document.getElementById("unregistered").appendChild(login);

    console.log("unregistered");
}

const constructDocumentForRegistered = async() => {
    const logout = document.createElement("a");
    logout.id = "logout";
    logout.innerText = "Logout";
    logout.href = "/";
    logout.addEventListener("click", () => {
        localStorage.removeItem("auth_token");
        window.location.href = "/";
    });

    const email = document.createElement("a");
    email.id = "email";

    const inputField = document.createElement("input");
    inputField.id = "add-item";
    inputField.type = "text";
    inputField.name = "todo";

    const title = document.createElement("h3");
    title.innerText = "Todo:";

    const todoList = document.createElement("ul");
    todoList.id = "todoList";

    const root = document.getElementById("registered");
    root.appendChild(logout);
    root.appendChild(email);
    root.appendChild(inputField);
    root.appendChild(title);
    root.appendChild(todoList);
    
    console.log("registered");
}

const addTodo = async() => {
    const newItem = document.getElementById("add-item");

    newItem.addEventListener("keydown", async(event) => {
        if (event.key == "Enter") {
            const token = localStorage.getItem("auth_token");

            const res = await fetch("/api/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ items: [newItem.value] })
            })

            newItem.value = "";

            fillTodoList();
        }
    })
}

const fillTodoList = async() => {
    const token = localStorage.getItem("auth_token");

    const res = await fetch("/api/todos", {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const todoJson = await res.json();

    if (!isRegistered()) {
        return;
    }

    const todoList = document.getElementById("todoList");
    todoList.innerHTML = "";

    for (let item of todoJson.items) {
        const newTodo = document.createElement("li");
        newTodo.innerText = item;
        todoList.appendChild(newTodo);
    }
}

const deconstructDocument = async() => {
    console.log("Document deconstructed");
    document.getElementById("unregistered").innerHTML = ""
    document.getElementById("registered").innerHTML = ""
}

const isRegistered = () => {
    return localStorage.getItem("auth_token") != null;
}

const constructDocument = async() => {
    deconstructDocument();

    if (!isRegistered()) {
        constructDocumentForUnregistered();
        return;
    }
    
    constructDocumentForRegistered();
    addTodo();
    fillTodoList();
}

constructDocument();

const submitButton = document.getElementById("submit-data")
const searchButton = document.getElementById("search")
const deleteButton = document.getElementById("delete-user")

submitButton.addEventListener("click", async function() {
    const n = document.getElementById("input-name").value
    const t = document.getElementById("input-task").value

    const data = {
        name: n,
        task: t
    }

    let res = await fetch("/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(data)
    })

    let responsedata = await res.json()

    const returnmessage = document.getElementById("return-message")
    returnmessage.textContent = responsedata.message
})


searchButton.addEventListener("click", async function() {
    const n = document.getElementById("search-name").value
    const p = document.getElementById("found-name")
    const t = document.getElementById("tasks")
    
    const list = document.getElementById("tasks")
    while (list.hasChildNodes())
    {
        list.removeChild(list.firstChild)
    }

    let res = await fetch("/user/" + n)
    let data = await res.json()

    if (data.name)
    {
        deleteButton.style.display = "block"

        p.innerText = data.name

        for (let task of data.todos)
        {
            const nt = document.createElement("ul")
            nt.innerText = task
            t.appendChild(nt)
        }
    } else {
        deleteButton.style.display = "none"
        p.innerText = data.message
    }

    console.log(data)
})

deleteButton.addEventListener("click", async function() {
    const n = document.getElementById("search-name").value
    const res = await fetch("/user/" + n, { method: "DELETE" })

    console.log(await res.json())


    document.getElementById("search-name").value = ""
    document.getElementById("found-name").innerText = ""
    deleteButton.style.display = "none"

    const list = document.getElementById("tasks")
    while (list.hasChildNodes())
    {
        list.removeChild(list.firstChild)
    }
})

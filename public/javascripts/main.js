const submitButton = document.getElementById("submit-data")
const searchButton = document.getElementById("search")
const deleteButton = document.getElementById("delete-button")

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

    let res = await fetch("/user/" + n)
    let data = await res.json()

    if (data.name)
    {
        deleteButton.style.display = "block"
    } else {
        deleteButton.style.display = "none"
    }

    console.log(data)
})

deleteButton.addEventListener("click", async function() {
    const n = document.getElementById("search-name").value
    const res = await fetch("/user/" + n, { method: "DELETE" })

    console.log(await res.json())
})

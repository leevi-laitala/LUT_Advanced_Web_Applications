
const breeds = [
    "husky",
    "akita",
    "shiba",
    "chow",
    "dingo"
]

async function createWikiItem(breed)
{
    let rootdiv = document.querySelector(".container")

    let wikiItem = document.createElement("div")
    wikiItem.className = "wiki-item"

    let wikiHeader = document.createElement("h1")
    wikiHeader.className = "wiki-header"
    wikiHeader.innerText = breed

    let wikiContent = document.createElement("div")
    wikiContent.className = "wiki-content"

    let wikiImg = document.createElement("img")
    wikiImg.className = "wiki-img"
    wikiImg.src = await fetchBreedImageUrl(breed)

    let wikiText = document.createElement("p")
    wikiText.className = "wiki-text"
    wikiText.innerText = await fetchBreedWikiSummary(breed)

    let imgContainer = document.createElement("div")
    imgContainer.className = "img-container"


    imgContainer.appendChild(wikiImg)
    wikiContent.appendChild(imgContainer)
    wikiContent.appendChild(wikiText)
    wikiItem.appendChild(wikiHeader)
    wikiItem.appendChild(wikiContent)

    rootdiv.appendChild(wikiItem)
}

async function fetchBreedImageUrl(breed)
{
    const url = "https://dog.ceo/api/breed/" + breed + "/images/random"

    const res = await fetch(url)
    const data = await res.json()

    return data.message
}

async function fetchBreedWikiSummary(breed)
{
    const url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + breed

    const res = await fetch(url)
    const data = await res.json()

    return data.extract
}

document.addEventListener("DOMContentLoaded", () => {
    for (let breed of breeds)
    {
        createWikiItem(breed)
    }
})

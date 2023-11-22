const addingredientButton = document.getElementById("add-ingredient")
const addinstructionButton = document.getElementById("add-instruction")
const submitButton = document.getElementById("submit")

const nametextInput = document.getElementById("name-text")
const ingredientsInput = document.getElementById("ingredients-text")
const instructionsInput = document.getElementById("instructions-text")

const viewRecipe = document.getElementById("recipe-name")
const viewIngredients = document.getElementById("ingredients-list")
const viewInstructions = document.getElementById("instructions-list")

let currentIngredients = []
let currentInstructions = []

document.addEventListener("DOMContentLoaded", loadRecipe("pizza"))

addingredientButton.addEventListener("click", function() {
    currentIngredients.push(ingredientsInput.value)
    ingredientsInput.value = ""
})

addinstructionButton.addEventListener("click", function() {
    currentInstructions.push(instructionsInput.value)
    instructionsInput.value = ""
})

submitButton.addEventListener("click", async function() {
    const res = await fetch("/recipe/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            name: nametextInput.value,
            ingredients: currentIngredients,
            instructions: currentInstructions
            })
    })

    const data = await res.json()
    
    loadRecipe(nametextInput.value)
})

function getRecipe(data)
{
    // Clear previous lists
    while(viewIngredients.hasChildNodes()) 
    {
        viewIngredients.removeChild(viewIngredients.firstChild)
    }

    while(viewInstructions.hasChildNodes())
    {
        viewInstructions.removeChild(viewInstructions.firstChild)
    }

    // Fill cleared lists
    for (let ingredient of data.ingredients)
    {
        let li = document.createElement("li")
        li.textContent = ingredient
        viewIngredients.appendChild(li)
    }

    for (let instruction of data.instructions)
    {
        let li = document.createElement("li")
        li.textContent = instruction
        viewInstructions.appendChild(li)
    }
    
    viewRecipe.innerText = data.name
}

async function loadRecipe(name)
{
    const res = await fetch("/recipe/" + name)
    const data = await res.json()

    getRecipe(data)
}

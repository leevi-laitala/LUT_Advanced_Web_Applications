const express = require("express")
const app = express()
const port = 3000

let textList = []

app.use(express.json())

app.use(express.static("root"))

app.get("/hello", (req, res) => {
    res.json({ msg: "Hello world" })
})

app.get("/echo/:id", (req, res) => {
    const idparam = req.params["id"]

    res.json({ id: idparam })
})

app.post("/sum", (req, res) => {
    const nums = req.body.numbers
    let numsSum = 0

    for (let i = 0; i < nums.length; i++)
    {
        numsSum += nums[i]
    }

    res.json({ sum: numsSum })
})

app.post("/list", (req, res) => {

    console.log(textList)
    console.log(req.body.text)

    textList.push(req.body.text)

    console.log(textList)

    res.json({ list: textList })
})

app.listen(port, () => {
    console.log("Server is listening at localhost:3000")
})

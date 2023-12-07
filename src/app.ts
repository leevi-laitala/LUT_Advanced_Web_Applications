// Followed these instructions on the environment setup:
// https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript

import express from "express";
const app = express();
const port = 3000;

app.use(express.json())

interface Vehicle {
    model: string;
    color: string;
    year: number;
    power: number;
}

interface Car extends Vehicle {
    bodyType: string;
    wheelCount: number;
}

interface Boat extends Vehicle {
    draft: number;
}

interface Plane extends Vehicle {
    wingspan: number;
}

let vehicles: Vehicle[] = [];

//app.get("/", (req, res) => {
//  res.send("Hello World!");
//});

app.get("/hello", (req, res) => {
  res.send("Hello world");
});

app.post("/vehicle/add", (req, res) => {
    let vehicle;

    if (req.body.bodyType || req.body.wheelCount) {
        vehicle = req.body as Car;
    } else if (req.body.draft) {
        vehicle = req.body as Boat;
    } else if (req.body.wingspan) {
        vehicle = req.body as Plane;
    } else {
        vehicle = req.body as Vehicle;
    }

    vehicles.push(vehicle)

    res.status(201).send("Vehicle added");
});

app.get("/vehicle/search/:model", (req, res) => {
    let model = req.params["model"];

    for (let vehicle of vehicles) {
        if (vehicle.model === model) {
            res.send(found);
            return;
        }
    }

    res.status(404);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

"use strict";
// Followed these instructions on the environment setup:
// https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
let vehicles = [];
//app.get("/", (req, res) => {
//  res.send("Hello World!");
//});
app.get("/hello", (req, res) => {
    res.send("Hello world");
});
app.post("/vehicle/add", (req, res) => {
    let vehicle;
    if (req.body.bodyType || req.body.wheelCount) {
        vehicle = req.body;
    }
    else if (req.body.draft) {
        vehicle = req.body;
    }
    else if (req.body.wingspan) {
        vehicle = req.body;
    }
    else {
        vehicle = req.body;
    }
    vehicles.push(vehicle);
    res.status(201).send("Vehicle added");
});
app.get("/vehicle/search/:model", (req, res) => {
    let model = req.params["model"];
    for (let vehicle of vehicles) {
        if (vehicle.model === model) {
            res.send(vehicle);
            return;
        }
    }
    res.status(404);
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map
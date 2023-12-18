"use strict";
//import express from "express";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Generated by GPT-3.5, when asked to fix the following error:
// Property 'user' does not exist on type 'Session & Partial<SessionData>'.
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const app = (0, express_1.default)();
const port = 3000;
//const session = require("express-session");
//const passport = require("passport")
const parser = require("body-parser");
//const LocalStrategy = require("passport-local").Strategy
var bcrypt = require("bcryptjs");
let users = [];
//function initAuth(passport) {
//    function authUser(username, password, done) {
//        const user = users.find((user) => { user.username === username })
//        if (!user) {
//            console.log("User not found");
//            return done(null, false);
//        }
//        
//        if (bcrypt.compareSync(password, user.password)) {
//            console.log("user: " + user.username + " logged in!");
//            return done(null, user);
//        } else {
//            console.log("Password incorrect");
//            return done(null, false);
//        }
//    }
//    
//    passport.use(new LocalStrategy(authenticateUser));
//    passport.serializeUser((user, done) => done(null, user.id));
//    passport.deserializeUser((id, done) => {
//        return done(null, users.find((user) => { user.id === id }));
//    })
//}
//function checkAuth(res, req, next) {
//    return (res.isAuthenticated()) ? res.redirect("/") : next();
//}
//
//initAuth(passport);
app.use(express_1.default.json());
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: "761397281d629389589548a97a112d058250cfe13624dcb2aa9827036f0ff065",
    resave: false,
    saveUninitialized: false
}));
//app.use(passport.initialize());
//app.use(passport.session());
app.post("/api/user/register", (req, res) => {
    if (req.session.user) {
        res.redirect("/");
        return;
    }
    const username = req.body.username;
    const password = req.body.password;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const idlen = 5;
    let id = Math.floor(Math.random() * 10);
    for (let i = 0; i < idlen; i++) {
        id *= 10;
        id += Math.floor(Math.random() * 10);
    }
    const user = { id: id, username: username, password: hash };
    users.push(user);
    res.send(users);
});
app.post("/api/user/login", (req, res) => {
    if (req.session.user) {
        res.redirect("/");
        return;
    }
    const username = req.body.username;
    const password = req.body.password;
    const user = users.find(u => u.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.status(200).send("Logged in");
    }
    else {
        res.status(401).send("Invalid credentials");
    }
});
app.get("/api/user/list", (req, res) => {
    if (!req.session.user) {
        res.status(401).send("Unauthorized");
        return;
    }
    res.status(200).send(users);
});
app.get("/api/secret", (req, res) => {
    console.log(req.session);
    if (!req.session.user) {
        res.status(401).send("Unauthorized");
        return;
    }
    res.status(200).send("Authorized");
});
app.get("/", (req, res) => {
    res.send("Hello world");
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map
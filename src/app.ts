import dotenv from "dotenv";

dotenv.config();

if (!process.env.SECRET) {
    process.env.SECRET = "verysecret";
}

import express, { Request, Response } from "express";
import session, { Session, SessionData } from "express-session";
interface CustomSession extends Session {
    user?: { id: number; username: string; password: string };
}

import { user } from "./model-user";
import { todo } from "./model-todo";
import { body, ValidationChain, validationResult, ValidationError } from "express-validator";

import passport, { DoneCallback } from "passport";
import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";

import jwt, { JwtPayload } from "jsonwebtoken";

passport.initialize();

passport.use(new Strategy(
    {
        secretOrKey: process.env.SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    async (token, done) => {
        const founduser = await user.findById(token.userId).exec();
        return done(null, founduser);
    }
));

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/testdb");
const db = mongoose.connection;

const app = express();
const port = 3000;

import multer, { Multer, StorageEngine } from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(upload.any());

var path = require("path");

app.use(express.static(path.join(__dirname, '../public')))

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

const parser = require("body-parser");

var bcrypt = require("bcryptjs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

const emailValidate: ValidationChain = body("email").trim().isEmail();
const pwdValidate: ValidationChain = body("password").isStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1
});

app.post("/api/user/register", emailValidate, pwdValidate, async (req, res) => {
    console.log(req.body.email);
    console.log(req.body.password);

    // Check if user exists
    let founduser = await user.findOne({ email: req.body.email }).exec();
    if (founduser) {
        return res.status(403).json({ email: "Email already in use." });
    }

    
    // Check if validations were successful
    const validationError = validationResult(req);
    if (!validationError.isEmpty()) {
        return res.status(400).json({ errors: validationError });
    }

    // Gen pwd hash and save user to db
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    await user.create({ email: req.body.email, password: hash });
    return res.status(200).send();
});

interface RequestUser extends Request {
    user: JwtPayload
}

function validateToken(req: RequestUser, res, next) {
    passport.authenticate("jwt", 
        { session: false }, 
        (err, verifiedUser) => {
            if (err || !verifiedUser) { return res.status(401).send(); }
            req.user = verifiedUser;
            next();
        }
    )(req, res, next);
}

app.post("/api/user/login", emailValidate, async (req, res) => {
    const founduser = await user.findOne({ email: req.body.email }).exec();
    if (!founduser) {
        return res.status(403).send("Login failed 1");
    }

    if (!bcrypt.compareSync(req.body.password, founduser.password)) {
        return res.status(401).send("Login failed 2");
    }

    const token = jwt.sign({ userId: founduser._id, email: founduser.email }, process.env.SECRET, { expiresIn: "1h" });
    return res.status(200).json({ success: true, token: token });
});

app.get("/api/private", validateToken, (req: RequestUser, res) => {
    return res.status(200).json({ email: req.user.email });
});





app.post("/api/todos", validateToken, async (req: RequestUser, res) => {
    const todolistExists = await todo.findOne({
        user: req.user._id
    });

    console.log(req.body.items);

    if (todolistExists) {
        for (let t of req.body.items) {
            console.log(t);
            todolistExists.items.push(t);
        }
        await todolistExists.save();
    } else {
        await todo.create({
            user: req.user._id,
            items: req.body.items
        })
    }

    res.status(200).send();
});

app.get("/api/todos", validateToken, async (req: RequestUser, res) => {
    const todos = await todo.findOne({ user: req.user._id });

    if (todos) {
        return res.json({ items: todos.items });
    }
})

app.get("/register.html", (req, res) => {
    res.render("register");
});

app.get("/login.html", (req, res) => {
    res.render("login");
});

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

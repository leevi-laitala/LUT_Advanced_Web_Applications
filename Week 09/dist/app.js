"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.SECRET) {
    process.env.SECRET = "verysecret";
}
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const model_user_1 = require("./model-user");
const model_todo_1 = require("./model-todo");
const express_validator_1 = require("express-validator");
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
passport_1.default.initialize();
passport_1.default.use(new passport_jwt_1.Strategy({
    secretOrKey: process.env.SECRET,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken()
}, (token, done) => __awaiter(void 0, void 0, void 0, function* () {
    const founduser = yield model_user_1.user.findById(token.userId).exec();
    return done(null, founduser);
})));
const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/testdb");
const db = mongoose.connection;
const app = (0, express_1.default)();
const port = 3000;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
app.use(upload.any());
var path = require("path");
app.use(express_1.default.static(path.join(__dirname, '../public')));
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
const parser = require("body-parser");
var bcrypt = require("bcryptjs");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
const emailValidate = (0, express_validator_1.body)("email").trim().isEmail();
const pwdValidate = (0, express_validator_1.body)("password").isStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1
});
app.post("/api/user/register", emailValidate, pwdValidate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body.email);
    console.log(req.body.password);
    // Check if user exists
    let founduser = yield model_user_1.user.findOne({ email: req.body.email }).exec();
    if (founduser) {
        return res.status(403).json({ email: "Email already in use." });
    }
    // Check if validations were successful
    const validationError = (0, express_validator_1.validationResult)(req);
    if (!validationError.isEmpty()) {
        return res.status(400).json({ errors: validationError });
    }
    // Gen pwd hash and save user to db
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    yield model_user_1.user.create({ email: req.body.email, password: hash });
    return res.status(200).send();
}));
function validateToken(req, res, next) {
    passport_1.default.authenticate("jwt", { session: false }, (err, verifiedUser) => {
        if (err || !verifiedUser) {
            return res.status(401).send();
        }
        req.user = verifiedUser;
        next();
    })(req, res, next);
}
app.post("/api/user/login", emailValidate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const founduser = yield model_user_1.user.findOne({ email: req.body.email }).exec();
    if (!founduser) {
        return res.status(403).send("Login failed 1");
    }
    if (!bcrypt.compareSync(req.body.password, founduser.password)) {
        return res.status(401).send("Login failed 2");
    }
    const token = jsonwebtoken_1.default.sign({ userId: founduser._id, email: founduser.email }, process.env.SECRET, { expiresIn: "1h" });
    return res.status(200).json({ success: true, token: token });
}));
app.get("/api/private", validateToken, (req, res) => {
    return res.status(200).json({ email: req.user.email });
});
app.post("/api/todos", validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todolistExists = yield model_todo_1.todo.findOne({
        user: req.user._id
    });
    console.log(req.body.items);
    if (todolistExists) {
        for (let t of req.body.items) {
            console.log(t);
            todolistExists.items.push(t);
        }
        yield todolistExists.save();
    }
    else {
        yield model_todo_1.todo.create({
            user: req.user._id,
            items: req.body.items
        });
    }
    res.status(200).send();
}));
app.get("/api/todos", validateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todos = yield model_todo_1.todo.findOne({ user: req.user._id });
    if (todos) {
        return res.json({ items: todos.items });
    }
}));
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
//# sourceMappingURL=app.js.map
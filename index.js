import express from "express";
import mongoose from "mongoose"
import multer from "multer"
import * as path from "path";
import cors from "cors"

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import {registerValidator, loginValidator} from "./validations/auth.js"

import checkAuth from "./validations/checkAuth.js"

import {register, profile, login, removeRrofile, update} from "./controllers/userController.js"

mongoose.connect(
    "mongodb+srv://admin:ihatekpi@cluster0.nu2roiy.mongodb.net/lab8?retryWrites=true&w=majority").then(
    () => {
        console.log("DB OK")
    }
).catch((err) => console.log("DB error", err))

const app = express();
app.use(cors());

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage
})


app.use(express.static(path.join(__dirname, 'build')));


app.get(['/*', '/register',], (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.post("/register", registerValidator, register);
app.post("/login", loginValidator, login);
app.get("/me", checkAuth, profile);
app.get("/checkAuth", checkAuth, (req, res) => res.json({
    success:true}));
app.delete("/me/deleteAccount", checkAuth, removeRrofile)
app.patch("/me/updateAccount", checkAuth, registerValidator, update)
app.post("/upload", upload.single("image"), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
});

app.listen(process.env.PORT || 5000, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK")
});



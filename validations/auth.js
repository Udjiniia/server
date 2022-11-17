import {body} from "express-validator"

export const registerValidator = [
    body("email", "Wrong email format").isEmail(),
    body("password", "Password should be min 5 characters").isLength({min: 5}),
    body("role", "Role should be min 2 characters").isLength({min: 2}),
    body("variant", "Variant should be min 1 characters").isLength({min: 1}),
    body("group", "Group should be min 4 characters").isLength({min: 4}),
    body("phone", "Phone should be min 10 characters").isLength({min: 10}),
    body("fullName", "Full name should be min 3 characters").isLength({min: 3}),
    body("avatarUrl").optional().isURL(),
]

export const loginValidator = [
    body("email", "Wrong email format").isEmail(),
    body("password", "Password should be min 5 characters").isLength({min: 5}),
]
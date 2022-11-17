import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const passwordUnhashed = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(passwordUnhashed, salt);

        const doc = new User({
            email: req.body.email,
            password: passwordHash,
            role: req.body.role,
            fullName: req.body.fullName,
            group: req.body.group,
            variant: req.body.variant,
            phone: req.body.phone,
            avatarUrl: req.body.avatarUrl,
        })

        const user = await doc.save();

        const token = jwt.sign({
                _id: user._id,
                email: req.body.email,
            }
            , "lab8", {
                expiresIn: '10d',
            });

        const {password, ...userData} = user._doc;

        res.json({userData, token});

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Registration failed"
            }
        )
    }
};

export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const user = await User.findOne({
            email: req.body.email
        })

        if (!user) {
            return res.status(404).json({
                message: "Wrong email or password"
            })
        }

        const isValidPassword = await bcrypt.compare(req.body.password, user._doc.password)

        if (!isValidPassword) {
            return res.status(404).json({
                message: "Wrong email or password!!"
            })
        }

        const token = jwt.sign({
                _id: user._id,
                email: req.body.email,
            }
            , "lab8", {
                expiresIn: '10d',
            });

        const {password, ...userData} = user._doc;

        res.json({userData, token});

    } catch
        (err) {
        console.log(err);
        res.status(500).json({
                message: "Login failed"
            }
        )
    }
};

export const profile = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            return res.status(404).json({
                message: "No such user"
            })
        }

        const {password, ...userData} = user._doc;

        res.json({userData});

    } catch (err) {
        res.status(403).json({
            message: "Not authorized",
        })
    }
};

export const removeRrofile = async (req, res) => {
    try {
        User.findOneAndDelete(
            {
                _id: req.userId,
            },
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(404).json({
                        message: 'Couldn`t delete user ',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'No such user',
                    });
                }

                res.json({
                    success: true,
                });
            },
        );
    } catch (err) {
        console.log(err);
        res.status(403).json({
            message: 'Could not delete user',
        });
    }
};

export const update = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }

        const passwordUnhashed = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(passwordUnhashed, salt);

        await User.findOneAndUpdate({
                _id: req.userId,
            },
            {
                email: req.body.email,
                password: passwordHash,
                role: req.body.role,
                fullName: req.body.fullName,
                group: req.body.group,
                variant: req.body.variant,
                phone: req.body.phone,
                avatarUrl: req.body.avatarUrl,
            })

        const user = await User.findById(req.userId)

        const token = jwt.sign({
                _id: user._id,
                email: req.body.email,
            }
            , "lab8", {
                expiresIn: '10d',
            });

        const {password, ...userData} = user._doc;
        res.json({...userData, token});

    } catch (err) {
        console.log(err);
        res.status(500).json({
                message: "Updating data failed"
            }
        )
    }
};
import CustomError from "../config/customError.js";
import asyncErrorHandler from "../helpers/asyncErrorHandler.js";
import { User } from "../models/userModel.js";
import StatusCode from "../helpers/httpStatusCode.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerController = asyncErrorHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        const error = new CustomError("Please provide name, email and password", StatusCode.BAD_REQUEST);
        return next(error);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const error = new CustomError("Email already registered", StatusCode.NOT_ACCEPTABLE);
        return next(error);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
        name,
        email,
        password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(StatusCode.CREATED).json({
        status: "success",
        message: "User successfully created!",
        token,
        data: {
            name,
            email,
            userId: user._id,
        },
    });
});

export const loginController = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = new CustomError("Please provide email and password", StatusCode.BAD_REQUEST);
        return next(error);
    }

    const user = await User.findOne({ email });
    if (!user) {
        const error = new CustomError("Invalid credentials", StatusCode.UNAUTHORIZED);
        return next(error);
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
        const error = new CustomError("Invalid credentials", StatusCode.UNAUTHORIZED);
        return next(error);
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(StatusCode.OK).json({
        status: "success",
        message: "User successfully logged in!",
        token,
        data: {
            name: user.name,
            email: user.email,
            userId: user._id,
        },
    });
});
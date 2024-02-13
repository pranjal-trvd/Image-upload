import CustomError from "../config/customError.js";
import asyncErrorHandler from "../helpers/asyncErrorHandler.js";
import { User } from "../models/userModel.js";
import StatusCode from "../helpers/httpStatusCode.js";

export const imageUploadController = asyncErrorHandler(async (req, res, next) => {
    const userId = req.userId;
    const imageFilename = req.file.filename;

    console.log(req.file);

    // console.log(imageFilename);
    // console.log(userId);

    if (!userId || !imageFilename) {
        const err = new CustomError("Invalid request", StatusCode.BAD_REQUEST);
        return next(err);
    }

    const user = await User.findById(userId);
    if (!user) {
        const err = new CustomError("User not found", StatusCode.NOT_FOUND);
        return next(err);
    }

    // Push the filename into the user's images array
    user.images.push(imageFilename);
    await user.save();

    res.status(201).json({
        status: "success",
        data: {
            image: imageFilename,
        },
    });
});

export const getImagesController = asyncErrorHandler(async (req, res, next) => {
    const userId = req.userId;

    if (!userId) {
        const err = new CustomError("Invalid request", StatusCode.BAD_REQUEST);
        return next(err);
    }

    const user = await User.findById(userId);
    if (!user) {
        const err = new CustomError("User not found", StatusCode.NOT_FOUND);
        return next(err);
    }

    res.status(200).json({
        status: "success",
        data: {
            images: user.images,
        },
    });
});
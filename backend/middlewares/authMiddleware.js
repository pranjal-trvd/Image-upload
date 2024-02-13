import CustomError from "../config/customError.js";
import StatusCode from "../helpers/httpStatusCode.js";
import jwt from "jsonwebtoken";
import asyncErrorHandler from "../helpers/asyncErrorHandler.js";

export const authMiddleware = asyncErrorHandler(async (req, res, next) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        // Get token from header
        const token_split = req.headers.authorization.split(" ");
        if (token_split.length !== 2) {
            const err = new CustomError("Invalid JWT token! Please login again", StatusCode.BAD_REQUEST);
            return next(err);
        }

        const token = token_split[1];
        if (!token) {
            const err = new CustomError("Not authorized", StatusCode.UNAUTHORIZED);
            return next(err);
        }

        try {
            // Verify token
            const access_secret_key = process.env.JWT_SECRET;
            if (!access_secret_key) {
                const err = new CustomError("Access secret key not found in env", StatusCode.INTERNAL_SERVER_ERROR);
                return next(err);
            }
            const { userId } = jwt.verify(token, access_secret_key);
            if (!userId) return next(new CustomError("Invalid JWT token! Please login again", StatusCode.FORBIDDEN));

            // Add decoded information to the request body
            req.userId = userId;
            // console.log(req.userId);
            // Continue to the next middleware or route handler
            return next();
        } catch (err) {
            // Handle token verification error
            return next(new CustomError(err, StatusCode.FORBIDDEN));
        }
    } else {
        const err = new CustomError("Not authorized", StatusCode.UNAUTHORIZED);
        return next(err);
    }
});
//extend native Error object , according to our need, whenever need to create a error , use this CustomError
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
        this.isOperational = true;

        // Adding isOperational flag to handle operational errors
        Error.captureStackTrace(this, this.constructor);
    }
}

// Exporting CustomError class
export default CustomError;
/* eslint-disable @typescript-eslint/no-explicit-any */

import CustomError from './../config/customError.js';
import StatusCode from './httpStatusCode.js';

// Function to handle development errors
const devErrors = (res, error) => {
  console.error(error);
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

// Function to handle CastError
const castErrorHandler = (err) => {
  const msg = `Invalid value for ${err.path}: ${err.value}!`;
  return new CustomError(msg, StatusCode.BAD_REQUEST);
};

// Function to handle duplicate key errors
const duplicateKeyErrorHandler = (err) => {
  const name = err.keyValue.name;
  const msg = `There is already a movie with name ${name}. Please use another name!`;

  return new CustomError(msg, StatusCode.BAD_REQUEST);
};

// Function to handle validation errors
const validationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const errorMessages = errors.join(". ");
  const msg = `Invalid input data: ${errorMessages}`;

  return new CustomError(msg, StatusCode.BAD_REQUEST);
};

// Function to handle production errors
const prodErrors = (res, error) => {
  console.error(error);
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      status: "error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

// Global error handler function
export default function globalErrorHandler(error, _req, res, _next) {
  error.statusCode = error.statusCode || StatusCode.INTERNAL_SERVER_ERROR;
  error.status = error.status || "error";

  if (process.env.DEV_MODE === "development") {
    // Dev errors help developers get detailed error information
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") error = castErrorHandler(error);
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);
    if (error.name === "ValidationError") error = validationErrorHandler(error);

    // Production errors are concise and easy to understand
    prodErrors(res, error);
  }
};

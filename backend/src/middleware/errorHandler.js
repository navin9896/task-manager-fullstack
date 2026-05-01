const mongoose = require("mongoose");
const { AppError } = require("../utils/AppError");
const { env } = require("../config/env");

function errorHandler(err, req, res, next) {
  // Normalize common Mongoose errors
  if (err instanceof mongoose.Error.ValidationError) {
    err = new AppError("Validation failed.", 400, err.errors);
  }
  if (err instanceof mongoose.Error.CastError) {
    err = new AppError("Invalid request value.", 400);
  }

  const isAppError = err instanceof AppError;

  const statusCode = isAppError ? err.statusCode : err.statusCode || 500;
  const payload = {
    message: isAppError ? err.message : "Internal server error.",
  };

  if (isAppError && err.details !== undefined) payload.details = err.details;
  if (env.NODE_ENV !== "production" && !isAppError) {
    payload.error = { name: err.name, message: err.message, stack: err.stack };
  }

  res.status(statusCode).json(payload);
}

module.exports = { errorHandler };


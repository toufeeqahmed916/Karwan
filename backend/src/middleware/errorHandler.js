import { AppError } from "../errors/AppError.js";

export function notFoundHandler(req, _res, next) {
  next(
    new AppError({
      code: "NOT_FOUND",
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      statusCode: 404,
    }),
  );
}

export function errorHandler(error, _req, res, _next) {
  const isOperational = error instanceof AppError && error.isOperational;
  const statusCode = isOperational ? error.statusCode : 500;
  const code = isOperational ? error.code : "SERVER_ERROR";
  const message = isOperational
    ? error.message
    : "An unexpected server error occurred";

  if (!isOperational) {
    console.error(error);
  } else if (error.cause) {
    console.error(`[${code}]`, error.cause);
  }

  const response = {
    error: {
      code,
      message,
    },
  };

  if (isOperational && error.details !== undefined) {
    response.error.details = error.details;
  }

  res.status(statusCode).json(response);
}

import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError.js';
import { NODE_ENV } from '../config/index.js';

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    // Handle Zod Validation Error
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      error = new ApiError(400, 'Validation Error', formattedErrors);
    } 
    // Handle Mongoose / Prisma CastError or similar
    else if (error.name === 'CastError' || error.code === 'P2025') {
      const message = `Resource not found`;
      error = new ApiError(404, message);
    } 
    // Handle Duplicate Fields (Mongoose or Prisma P2002)
    else if (error.code === 11000 || error.code === 'P2002') {
      const message = `Duplicate field value entered`;
      error = new ApiError(400, message);
    } 
    // Fallback unhandled errors
    else {
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal Server Error';
      error = new ApiError(statusCode, message, [], err.stack);
    }
  }

  const response = {
    success: error.success,
    message: error.message,
    errors: error.errors,
    ...(NODE_ENV === 'development' ? { stack: error.stack } : {}),
  };

  res.status(error.statusCode).json(response);
};

export { errorHandler };

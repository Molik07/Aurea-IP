import { ApiError } from '../utils/ApiError.js';
import { ZodError } from 'zod';

const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((e) => ({
        field: e.path.join('.').replace(/^(body\.|query\.|params\.)/, ''), // Clean up prefix for client
        message: e.message,
      }));
      return next(new ApiError(400, 'Validation Error', formattedErrors));
    }
    next(error);
  }
};

export { validate };

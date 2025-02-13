export class AppError extends Error {
  constructor(message, statusCode = 500, errors = {}) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error) => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    errors: error.errors
  });

  if (error.isOperational) {
    return {
      message: error.message,
      errors: error.errors,
      status: error.statusCode
    };
  }

  // Erreur non opérationnelle (bug, erreur de syntaxe, etc.)
  return {
    message: 'Une erreur interne est survenue',
    status: 500
  };
};

export const catchAsync = (handler) => {
  return async (request, params) => {
    try {
      return await handler(request, params);
    } catch (error) {
      const errorResponse = handleError(error);
      return Response.json(
        { message: errorResponse.message, errors: errorResponse.errors },
        { status: errorResponse.status }
      );
    }
  };
}; 
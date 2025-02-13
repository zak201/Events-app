export class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      errors: this.errors,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined
    };
  }
}

export const errorHandler = (err, req, res) => {
  // Log l'erreur
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString()
  });

  // Erreurs opérationnelles (attendues)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      errors: err.errors
    });
  }

  // Erreurs non opérationnelles (bugs)
  return res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Une erreur interne est survenue'
  });
};

export const catchAsync = (handler) => {
  return async (request, params) => {
    try {
      return await handler(request, params);
    } catch (error) {
      const errorResponse = errorHandler(error, request, response);
      return errorResponse;
    }
  };
}; 
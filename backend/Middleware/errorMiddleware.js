/**
 * @desc Handle 404 - Resource Not Found
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * @desc Global Error Catcher
 */
export const errorHandler = (err, req, res, next) => {
  // Log the error for the Jacksteve Admin Command
  console.error(`[SYSTEM ERROR]: ${err.message}`);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Handle Mongoose Bad ID (Cast Error)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    err.message = 'Resource not found';
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};

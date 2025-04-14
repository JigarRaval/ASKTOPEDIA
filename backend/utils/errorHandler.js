export const errorHandler = (res, error, statusCode = 500) => {
  console.error("Error:", error.message || error);
  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};

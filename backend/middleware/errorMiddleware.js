// /backend/middleware/errorMiddleware.js

// Middleware para manejar rutas inexistentes (404 Not Found)
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Middleware general para manejar errores (El que está capturando el 401 y lo cambia)
const errorHandler = (err, req, res, next) => {
  // 1. Determinar el Status Code: Usa el código de status actual (ej. 401),
  //    o si el status actual es 200 (éxito), cámbialo a 500 (Error de Servidor).
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // 2. Aplicar el Status Code
  res.status(statusCode);

  // 3. Devolver la respuesta de error
  res.json({
    message: err.message,
    // En desarrollo, devuelve el stack trace
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };

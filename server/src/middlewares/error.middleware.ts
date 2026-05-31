import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Erro interno do servidor';
  
  console.error(`[Error Handler] [${req.method}] ${req.url}:`, {
    message: err.message || err,
    stack: err.stack,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

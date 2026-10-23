import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to log HTTP requests and responses.
 */
@Injectable()
export class HttpLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  /**
   * Middleware to log HTTP requests and responses.
   * Logs the method, URL, status code, and response time.
   *
   * @param {Request} req - The incoming request object.
   * @param {Response} res - The outgoing response object.
   * @param {NextFunction} next - The next middleware function in the stack.
   */
  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const start = Date.now();

    this.logger.log(`Request: ${method} "${originalUrl}"`);

    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log(`Response: ${method} "${originalUrl}" ${res.statusCode} +${duration}ms`);
    });

    next();
  }
}

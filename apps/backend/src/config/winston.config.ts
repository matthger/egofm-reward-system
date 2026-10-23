import * as winston from 'winston';

export const winstonLogger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, context }) => {
      return `[${timestamp}] ${level.toUpperCase()}${
        context ? ' [' + context + ']' : ''
      }: ${message}`;
    }),
  ),
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    }),
  ],
});

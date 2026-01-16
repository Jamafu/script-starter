import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

// Custom log format supporting metadata
const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  // Remove level, message, timestamp from meta
  const metaData = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return `${timestamp} [${level}]: ${message}${metaData}`;
});

export const scriptLogger = createLogger({
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [
    new transports.Console({
      format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    }),
    new transports.File({
      filename: 'error.log',
      level: 'error',
    }),
    new transports.File({
      filename: 'combined.log',
    }),
  ],
});

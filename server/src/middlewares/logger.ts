import { Request, Response, NextFunction } from "express";
import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf } = format;

const logFormat = printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({
      format: () => new Date().toLocaleString(),
    }),
    logFormat
  ),
  transports: [new transports.File({ filename: "logs/requests.log" })],
});

export default (req: Request, res: Response, next: NextFunction) => {
  const message = `${req.method} ${req.originalUrl} ${res.statusCode}`;
  logger.info(message);
  next();
};

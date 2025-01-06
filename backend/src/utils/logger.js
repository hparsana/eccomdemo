import winston from "winston";
import path from "path";

// Define log directory
const logDirectory = path.join("logs");

// Create Winston logger instance
const logger = winston.createLogger({
  level: "error", // Log only errors
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() // Logs in JSON format
  ),
  transports: [
    // Log to a file
    new winston.transports.File({
      filename: path.join(logDirectory, "errors.log"),
    }),
    // Log to the console
    new winston.transports.Console(),
  ],
});

export default logger;

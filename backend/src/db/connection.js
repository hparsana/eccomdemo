import mongoose from "mongoose";
import { DBname } from "../utils/constant.js";
import fs from "fs";
import path from "path";
import winston from "winston";

// Configure Winston Logger
const logger = winston.createLogger({
  level: "error",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join("logs", "errors.log") }),
  ],
});

const connection = async () => {
  try {
    // Attempt to connect to MongoDB
    const mongoConnect = await mongoose.connect(
      `${process.env.MONGO_URI_LOCAL}/${DBname}`
    );
    console.log(`DataBase Connected !! ${mongoConnect.connection.host}`);
  } catch (error) {
    // Log the error to both console and file
    logger.error({
      message: error.message,
      stack: error.stack,
      timestamp: new Date(),
    });

    // Optionally log a simple text version of the error to the file (fallback)
    const logFilePath = path.join("logs", "errors.log");
    fs.appendFileSync(
      logFilePath,
      `[${new Date().toISOString()}] MongoDB Connection Error: ${error.message}\nStack Trace: ${error.stack}\n\n`
    );

    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit the application after logging the error
  }
};

export default connection;

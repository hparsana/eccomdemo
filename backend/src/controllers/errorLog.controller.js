import ErrorLog from "../models/errorLog.model.js";
import fs from "fs";
import path from "path";

export const getErrorLogs = async (req, res) => {
  try {
    const logs = await ErrorLog.find().sort({ createdAt: -1 }).limit(50); // Fetch latest 50 logs
    return res.status(200).json({
      statusCode: 200,
      success: true,
      data: logs,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Failed to fetch error logs",
      success: false,
    });
  }
};

export const getFileLogs = (req, res) => {
  try {
    const logFilePath = path.join(process.cwd(), "logs", "errors.log");

    // Check if the log file exists
    if (!fs.existsSync(logFilePath)) {
      return res.status(404).json({
        statusCode: 404,
        message: "Log file not found.",
        success: false,
      });
    }

    // Read the log file
    const logs = fs.readFileSync(logFilePath, "utf-8");

    // Split logs into lines for easier handling
    const logLines = logs.split("\n").filter((line) => line.trim() !== "");

    // Group logs into structured objects
    const structuredLogs = [];
    let currentError = null;

    logLines.forEach((line) => {
      try {
        // Try parsing as JSON
        const parsed = JSON.parse(line);
        if (currentError) {
          structuredLogs.push(currentError); // Push the previous error if exists
        }
        currentError = parsed; // Start a new error
      } catch {
        // If it's plain text, categorize as stack trace or message
        const timestampMatch = line.match(/\[(.*?)\]/);
        if (timestampMatch) {
          // New error with timestamp
          if (currentError) {
            structuredLogs.push(currentError); // Push the previous error
          }
          currentError = {
            timestamp: timestampMatch[1],
            message: line.replace(timestampMatch[0], "").trim(),
            level: "unknown",
            stack: "",
          };
        } else if (currentError) {
          // Append to stack trace of the current error
          currentError.stack += `${line.trim()}\n`;
        }
      }
    });

    // Push the last error if it exists
    if (currentError) {
      structuredLogs.push(currentError);
    }

    // Sort logs by timestamp (descending order)
    structuredLogs.sort((a, b) => {
      const dateA = new Date(a.timestamp || 0);
      const dateB = new Date(b.timestamp || 0);
      return dateB - dateA; // Sort in descending order (newest first)
    });

    // Return consolidated logs
    return res.status(200).json({
      statusCode: 200,
      success: true,
      data: structuredLogs,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      message: "Failed to read log file",
      success: false,
    });
  }
};
